using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Driver;
using ScheduleAggregator.Harvesters;
using log4net;

namespace ScheduleAggregator.Importers
{
    public class AiringsImporter
    {
        private readonly MongoDatabase database;
        private readonly ILog logger = LogManager.GetLogger(typeof(AiringsImporter));

        public AiringsImporter( MongoDatabase database )
        {
            this.database = database;
        }

        public List<Airing> Import( DateTime startDate, DateTime endDate )
        {
            var scheduleCollection = database.GetCollection<Airing>("schedule");            

            var timespan = new TimeSpan(endDate.Ticks - startDate.Ticks);

            logger.InfoFormat("Harvesting schedules for {0} days between '{1}' and '{2}'", timespan.TotalDays,
                              startDate.ToShortDateString(), endDate.ToShortDateString());

            var competitiveHarvester = new CompetitiveAiringHarvester();
            var digitalHarvester = new DigitalAiringHarvester();
            var linearHarvester = new LinearAiringHarvester();

            var airings = new List<Airing>();

            var competitiveAirings = competitiveHarvester.Harvest(startDate, endDate);
            airings.AddRange(competitiveAirings);

            var digitalAirings = digitalHarvester.Harvest(startDate, endDate);
            airings.AddRange(digitalAirings);

            var linearAirings = linearHarvester.Harvest(startDate, endDate);
            airings.AddRange(linearAirings);

            // Drop all airings and the insert the new items
            scheduleCollection.RemoveAll();
            scheduleCollection.InsertBatch(airings);

            logger.InfoFormat("Import complete.  {0} records written to mongolab.", airings.Count);

            return airings;
        }
    }
}
