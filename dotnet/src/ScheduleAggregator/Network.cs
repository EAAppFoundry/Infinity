using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ScheduleAggregator
{
    public class Network
    {     
        [BsonId]
        public ObjectId Id { get; set; }

        public string Name { get; set; }
        public string NielsenCode { get; set; }
        public bool IsTurnerNetwork { get; set; }
        public string ScarlettCode { get; set; }
        public string Code { get; set; }
    }
}
