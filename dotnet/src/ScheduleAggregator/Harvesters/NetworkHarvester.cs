using System;
using System.Collections.Generic;
using System.Linq;
using ScheduleAggregator.Data;
using log4net;

namespace ScheduleAggregator.Harvesters
{
    public class NetworkHarvester : IDisposable
    {
        private readonly TurniverseEntities turniverseEntities;
        private readonly CompGridEntities compGridEntities;
        private readonly ILog logger = LogManager.GetLogger(typeof(NetworkHarvester));

        public NetworkHarvester()
        {
            this.turniverseEntities = new TurniverseEntities();
            this.compGridEntities = new CompGridEntities();

        }

        public List<Network> Harvest()
        {
            var turnerNetworks = from ps in turniverseEntities.ProgramServices
                                 select new Network
                                            {
                                                Code = ( ps.IsTurnerNetwork.Value ? ps.ScarlettNetworkCode : ps.ShortName.ToUpper() ),
                                                Name = ps.Name,
                                                ScarlettCode = ps.ScarlettNetworkCode,
                                                IsTurnerNetwork = ps.IsTurnerNetwork.Value
                                            };

            return turnerNetworks.ToList();
        }

        public void Dispose()
        {
            this.turniverseEntities.Dispose();
            this.compGridEntities.Dispose();
        }
    }
}