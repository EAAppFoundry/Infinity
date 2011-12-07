using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ScheduleAggregator
{
    public class Airing
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string ExternalId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Network { get; set; }
        public Title Title { get; set; }

        public string Platform { get; set; }
        public string Source { get; set; }
    }
}
