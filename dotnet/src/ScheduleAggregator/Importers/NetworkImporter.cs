using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Driver;
using ScheduleAggregator.Data;
using ScheduleAggregator.Harvesters;
using log4net;

namespace ScheduleAggregator.Importers
{
    public class NetworkImporter
    {
        private readonly MongoDatabase database;
        private readonly ILog logger = LogManager.GetLogger(typeof (NetworkImporter));

        public NetworkImporter(MongoDatabase database)
        {
            this.database = database;
        }

        public List<Network> Import()
        {
            var networkCollection = database.GetCollection<Network>("network");            

            using( var harvester = new NetworkHarvester())
            {
                logger.InfoFormat("Importing networks");

                var networks = harvester.Harvest();

                networkCollection.RemoveAll();
                networkCollection.InsertBatch(networks);

                logger.InfoFormat("Loaded '{0}' networks", networks.Count);

                return networks.ToList();
            }
        }
    }
}
