using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ScheduleAggregator.Data;
using ScheduleAggregator.EA.Turniverse.BlocksOfTime;

namespace ScheduleAggregator.Harvesters
{
    public class DigitalAiringHarvester
    {
        public IEnumerable<Airing> Harvest(DateTime startDate, DateTime endDate)
        {
            var airings = new List<Airing>();

            using (var turniverseEntities = new TurniverseEntities())
            {
                var feeds = from f in turniverseEntities.Feeds
                            join schedule in turniverseEntities.Schedules on f.ScheduleID equals schedule.ScheduleID
                            join ps in turniverseEntities.ProgramServices on schedule.ProgramServiceID equals
                                ps.ProgramServiceID
                            where f.IsMaster.Value && f.IsActive
                            select new { FeedId = f.FeedID, Network = ps.ShortName };

                foreach (var feed in feeds)
                {
                    using (var service = new BlockOfTimeServiceClient("CustomBinding_IBlockOfTimeService"))
                    {
                        var requestMessage = new LoadFullSchedulesRequestMessage();
                        requestMessage.Request = new LoadFullSchedulesRequest();
                        requestMessage.Request.SummaryRequests = new List<ReadBlockOfTimeSummaryRequest>
                                                                     {
                                                                         new ReadBlockOfTimeSummaryRequest
                                                                             {
                                                                                 EndDate = endDate,
                                                                                 StartDate = startDate,
                                                                                 FeedID = feed.FeedId,
                                                                                 State = BlockOfTimeState.Released
                                                                             }
                                                                     };

                        var responseMessage = service.LoadFullSchedules(requestMessage);

                        var response = responseMessage.Response.Times[0];

                        var summaries = from summary in response.BlocksOfTime
                                        select new Airing
                                        {
                                            StartDate = summary.StartDate,
                                            EndDate = summary.EndDate,
                                            ExternalId = summary.BlockOfTimeID.ToString(),
                                            Network = feed.Network,
                                            Source = "Digital",
                                            Platform =
                                                summary.ScheduleType == ScheduleTypeEnum.BroadbandScheduleType
                                                    ? "Broadband"
                                                    : "VOD",
                                            Title = new Title
                                            {
                                                Id = summary.TitleId,
                                                Name = summary.Name,
                                                ReleaseYear = summary.ReleaseYear,
                                                Rating = summary.TVRatingCode,
                                                Storyline = summary.StoryLine,
                                            }
                                        };

                        airings.AddRange(summaries.ToList());
                    }
                }
            }

            return airings;
        }
    }
}
