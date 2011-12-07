using System;
using System.Collections.Generic;
using System.Linq;
using ScheduleAggregator.Data;
using log4net;

namespace ScheduleAggregator.Harvesters
{
    public class CompetitiveAiringHarvester
    {
        private readonly ILog logger = LogManager.GetLogger(typeof(CompetitiveAiringHarvester));

        public IEnumerable<Airing> Harvest(DateTime startDate, DateTime endDate)
        {
            var networkHarvester = new NetworkHarvester();
            var networks = networkHarvester.Harvest();

            List<Airing> airings = null;

            using (var compGridEntities = new CompGridEntities())
            {
                var data = from airing in compGridEntities.T_TRIB_AIRING
                           join program in compGridEntities.T_TRIB_PROGRAM on airing.PROGRAM_ID equals program.PROGRAM_ID
                           join network in compGridEntities.T_TRIB_NETWORK on airing.NETWORK_ID equals network.NETWORK_ID
                           join genre in compGridEntities.T_TRIB_GENRE on program.GENRE_ID equals genre.GENRE_ID
                           where airing.AIR_DATE >= startDate && airing.AIR_DATE <= endDate
                           select new
                           {
                               StartDate = airing.AIR_DATE,
                               SecondsSinceMidnight = airing.AIR_TIME,
                               Duration = airing.DURATION_SEC,
                               Network = network.CALL_SIGN,
                               Title = new Title
                               {
                                   Id = (int)program.PROGRAM_ID,
                                   Name = program.EPISODE_NAME,
                                   SeriesName = program.TITLE_NAME,
                                   ReleaseYear = program.RELEASE_YEAR.Value,
                                   Rating = program.MPAA_RATING,
                                   Genre = genre.GENRE_NAME,
                                   Type = program.TYPE_CD,
                                   Storyline = program.DESCRIPTION
                               }
                           };

                airings = (from d in data.ToList()
                           select new Airing
                           {
                               StartDate = d.StartDate.AddSeconds(d.SecondsSinceMidnight),
                               EndDate = d.StartDate.AddSeconds(d.SecondsSinceMidnight).AddSeconds(d.Duration),
                               Network = d.Network,
                               Source = "Competitive",
                               Platform = "Linear",
                               Title = d.Title
                           }).ToList();

                var turnerAirings = from airing in airings
                                    join network in networks on airing.Network equals network.Code
                                    where network.IsTurnerNetwork
                                    select airing;

                airings = airings.Except(turnerAirings).ToList();
            }

            logger.InfoFormat("Retrieved {0} competitive airings for all networks between '{1}' and '{2}'",
                              airings.Count, startDate.ToShortDateString(), endDate.ToShortDateString());

            return airings;
        }
    }
}
