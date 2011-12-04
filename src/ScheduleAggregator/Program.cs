using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Driver;
using ScheduleAggregator.Harvesters;
using log4net;

namespace ScheduleAggregator
{
    class Program
    {
        static void Main(string[] args)
        {
            const string connectionString = "mongodb://scheduling:scheduling@ds029117.mongolab.com:29117";
            var server = MongoServer.Create(connectionString);
            var database = server.GetDatabase("scheduling");
            var logger = LogManager.GetLogger(typeof (Program));

            server.Connect();

            if (!database.CollectionExists("schedule"))
                database.CreateCollection("schedule");

            var scheduleCollection = database.GetCollection<Airing>("schedule");

            scheduleCollection.RemoveAll();

            var startDate = new DateTime(2011, 12, 1);
            var endDate = startDate.AddDays(1);
            var timespan = new TimeSpan(endDate.Ticks - startDate.Ticks);

            logger.InfoFormat("Harvesting schedules for {0} days between '{1}' and '{2}'", timespan.TotalDays,
                              startDate.ToShortDateString(), endDate.ToShortDateString());

            var competitiveHarvester = new CompetitiveAiringHarvester();
            var digitalHarvester = new DigitalAiringHarvester();
            var linearHarvester = new LinearAiringHarvester();

            var airings = new List<Airing>();
            var competitiveAirings = competitiveHarvester.Harvest(startDate, endDate);
            var digitalAirings = digitalHarvester.Harvest(startDate, endDate);
            var linearAirings = linearHarvester.Harvest(startDate, endDate);

            airings.AddRange(competitiveAirings);
            airings.AddRange(digitalAirings);
            airings.AddRange(linearAirings);

            scheduleCollection.InsertBatch(airings);

            logger.InfoFormat("Import complete.  {0} records written to mongolab.", airings.Count);

            server.Disconnect();
        }
    }
}
