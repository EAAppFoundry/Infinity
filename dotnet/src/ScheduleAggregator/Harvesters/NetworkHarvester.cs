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
            var networks = turniverseEntities.ProgramServices.Select(ps =>
                                                                     new Network
                                                                         {
                                                                             Name = ps.Name,
                                                                             Code = ps.ShortName,
                                                                             IsTurnerNetwork = ps.IsTurnerNetwork.Value,
                                                                             ScarlettCode = ps.ScarlettNetworkCode
                                                                         }).ToList();

            foreach (var tribNetwork in compGridEntities.T_TRIB_NETWORK)
            {
                var network =
                    networks.FirstOrDefault(n => (n.IsTurnerNetwork ? n.ScarlettCode : n.Code) == tribNetwork.NIELSEN_CD);

                if (network != null)
                {
                    logger.DebugFormat("Matched Neilsen code of '{0}' to the network code '{1}'", tribNetwork.NIELSEN_CD, tribNetwork.CALL_SIGN);

                    network.NielsenCode = tribNetwork.NIELSEN_CD;
                }
                else
                {
                    logger.InfoFormat("No Neilsen code was located for the network '{0}'", tribNetwork.CALL_SIGN);
                }
            }

            return networks.ToList();
        }

        public void Dispose()
        {
            this.turniverseEntities.Dispose();
            this.compGridEntities.Dispose();
        }
    }
}