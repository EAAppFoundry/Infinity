using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScheduleAggregator
{
    public class Title
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SeriesName { get; set; }
        public int ReleaseYear { get; set; }

        public string Rating { get; set; }
        public string Genre { get; set; }
        public string Type { get; set; }
        public string Storyline { get; set; }
    }
}
