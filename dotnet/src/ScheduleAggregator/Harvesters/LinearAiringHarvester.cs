using System;
using System.Collections.Generic;
using System.Linq;
using ScheduleAggregator.Data;
using log4net;

namespace ScheduleAggregator.Harvesters
{
    public class LinearAiringHarvester : IDisposable
    {
        readonly ScarlettEntities entities = new ScarlettEntities();
        private readonly ILog logger = LogManager.GetLogger(typeof (LinearAiringHarvester));

        public void Dispose()
        {
            entities.Dispose();
        }

        public IEnumerable<Airing> Harvest( DateTime startDate, DateTime endDate )
        {
            var queryable = from franchiseAiring in entities.FranchiseAirings
                            join titleAiring in entities.TitleAirings on franchiseAiring.FRANCHISE_AIRING_ID equals
                                titleAiring.FRANCHISE_AIRING_ID
                            join title in entities.Titles on titleAiring.TITLE_ID equals title.TITLE_ID
                            join seriesTitle in entities.Titles on title.SERIES_TITLE_ID equals seriesTitle.TITLE_ID into seriesTitles
                            join schedule in entities.LinearSchedules on franchiseAiring.SCHEDULE_ID equals schedule.SCHEDULE_ID
                            join titleSchedule in entities.LinearSchedules on titleAiring.SCHEDULE_ID equals titleSchedule.SCHEDULE_ID
                            join networkTitle in entities.NetworkTitles on titleAiring.TITLE_ID equals networkTitle.TITLE_ID
                            from st in seriesTitles.DefaultIfEmpty()
                            where ( schedule.SCHED_TYPE_CD == "R" && titleSchedule.SCHED_TYPE_CD == "R" ) &&
                                  ( schedule.NETWORK_FEED_CD == "E" && titleSchedule.NETWORK_FEED_CD == "E" ) &&
                                  (titleAiring.ACTION_IND != "X" && titleAiring.ACTION_IND != "D") &&
                                  franchiseAiring.SCHEDULE_AIR_DATE >= startDate &&
                                  franchiseAiring.SCHEDULE_AIR_DATE <= endDate
                            select new
                                       {
                                           ExternalId = franchiseAiring.FRANCHISE_AIRING_ID,
                                           StartDate = franchiseAiring.SCHEDULE_AIR_DATE,
                                           Duration = franchiseAiring.LENGTH,
                                           StartTime = franchiseAiring.FRANCHISE_AIRING_START_TIME,
                                           Network = schedule.NETWORK_CD,
                                           TitleId = (int)title.TITLE_ID,
                                           TitleName = title.TITLE_NAME,
                                           SeriesName = st.TITLE_NAME ?? "",
                                           ReleaseYear = title.RELEASE_YEAR,
                                           TitleType = title.TITLE_TYPE_CD,
                                       };

            // Get only distinct airings
            var executedResults = queryable.ToList().GroupBy(a => a.ExternalId).Select(g => g.First());

            logger.InfoFormat("Retrieved {0} linear airings for all networks between '{1}' and '{2}'",
                              executedResults.Count(), startDate.ToShortDateString(), endDate.ToShortDateString());

            return from result in executedResults
                   select new Airing
                              {
                                  EndDate =
                                      result.StartDate.Value.AddSeconds(result.StartTime).AddSeconds(
                                          result.Duration.Value),
                                  ExternalId = result.ExternalId.ToString(),
                                  Network = result.Network,
                                  Platform = "Linear",
                                  Source = "Linear",
                                  StartDate = result.StartDate.Value.AddSeconds(result.StartTime),
                                  Title = new Title
                                              {
                                                  Id = result.TitleId,
                                                  Name = result.TitleName,
                                                  SeriesName = result.SeriesName,
                                                  ReleaseYear = result.ReleaseYear
                                              }
                              };
        }

    }
}
