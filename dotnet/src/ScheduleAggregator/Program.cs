using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Driver;
using ScheduleAggregator.Harvesters;
using ScheduleAggregator.Importers;
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

            var startDate = DateTime.Now.Date.AddDays( -45 );
            var endDate = startDate.AddDays(14);

            var networkImporter = new NetworkImporter(database);
            networkImporter.Import();

            var airingsImporter = new AiringsImporter(database);
            airingsImporter.Import(startDate, endDate);

            server.Disconnect();
        }
    }
}
