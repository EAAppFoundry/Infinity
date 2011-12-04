using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Driver;
using ScheduleAggregator.Harvesters;

namespace ScheduleAggregator
{
    class Program
    {
        static void Main(string[] args)
        {
            const string connectionString = "mongodb://scheduling:scheduling@ds029117.mongolab.com:29117";
            var server = MongoServer.Create(connectionString);
            var database = server.GetDatabase("scheduling");

            server.Connect();

            if (!database.CollectionExists("schedule"))
                database.CreateCollection("schedule");

            var scheduleCollection = database.GetCollection<Airing>("schedule");

            scheduleCollection.RemoveAll();

            var startDate = new DateTime(2011, 12, 1);
            var endDate = startDate.AddDays(1);

            var competitiveHarvester = new CompetitiveAiringHarvester();
            var digitalHarvester = new DigitalAiringHarvester();
            var linearHarvester = new LinearAiringHarvester();

            var airings = new List<Airing>();
            var competitiveAirings = new List<Airing>(); // competitiveHarvester.Harvest(startDate, endDate);
            var digitalAirings = new List<Airing>(); // digitalHarvester.Harvest(startDate, endDate);
            var linearAirings = linearHarvester.Harvest(startDate, endDate);

            airings.AddRange(competitiveAirings);
            airings.AddRange(digitalAirings);
            airings.AddRange(linearAirings);

            scheduleCollection.InsertBatch(airings);

            server.Disconnect();
        }
    }
}
