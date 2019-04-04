// [lyn, 09/16/15] Wrote this paper list generation JavaScript magic

var countryAbbreviations = {"United States of America":"USA", "United Kingdom":"UK"};
function countryName(country) {
  abbrev = countryAbbreviations[country];
  return abbrev ? abbrev : country; // If there's an abbreviation, return it; otherwise return original string
}

function compareByFirstAuthorName(paper1, paper2) {
  var firstAuthor1 = paper1.authors[0];
  var firstAuthor2 = paper2.authors[0];
  if (firstAuthor1.last < firstAuthor2.last) {
    return -1;
  } else if (firstAuthor1.last > firstAuthor2.last) {
    return 1; 
  } else if // Author last name is the same; sort by first
      (firstAuthor1.first < firstAuthor2.first) {
    return -1; 
  } else if (firstAuthor1.first > firstAuthor2.first) {
    return 1; 
  } else if // Author name is the same; sort by paper title
      (paper1.title < paper2.title) {
    return -1;
  } else if (paper1.title >  paper2.title) {
    return 1;
  } else { // They're the same!
    return 0;
  }
}

function addPapersByType() {
  papers = allPapers.filter(function(p) { return p.type == "paper"; });
  papers.sort(compareByFirstAuthorName);
  positions = allPapers.filter(function(p) { return p.type == "position"; });
  positions.sort(compareByFirstAuthorName);
  function addEntry (paper, listId) {
    var paperEntry = $('#template > .paperEntry').clone();
    function addAuthor (author, authorListElt) {
      var authorEntry = $('#template > .authorEntry').clone();
      authorEntry.find(".authorName").html(author.first + " " + author.last);
      orgPlusCountry = author.org + ", " + countryName(author.country);
      authorEntry.find(".orgName").html(orgPlusCountry);
      authorEntry.appendTo(paperEntry.find(".authorList"));
    } 
    paperEntry.find(".paperTitle > a")
      .attr("href", "pdfProceedings/" + paper.pdf)
      .html(paper.title);
    for (var i = 0; i < paper.authors.length; i++) {
      addAuthor(paper.authors[i]);
    }
    paperEntry.appendTo(listId);
  }
  for (var i = 0; i < papers.length; i++) {
    addEntry(papers[i], "#paperList");
  }
  for (var i = 0; i < positions.length; i++) {
    addEntry(positions[i], "#positionList");
  }
}

// JSON describing all papers
allPapers = 
[
 {title: "Ten things we've learned from Blockly", 
  number: 1, 
  type: "position", 
  pdf: "p01_Fraser.pdf", 
  authors: [{first: "Neil", 
             last: "Fraser",
             email:"fraser@google.com", 
             country: "United States of America", 
             org: "Google"}
    ]
 }, 

 {title: "Blocks In, Blocks Out: A Language for 3D Models", 
  number: 2, 
  type: "paper", 
  pdf: "p02_Johnson.pdf", 
  authors: [{first: "Chris", 
             last: "Johnson", 
             email: "johnch@uwec.edu",
             country: "United States of America", 
             org: "University of Wisconsin, Eau Claire"}, 
            {first: "Peter", 
             last: "Bui",
             email:"pbui@nd.edu", 
             country: "United States of America",
             org: "University of Notre Dame"}
    ]
 }, 

 {title: "Incorporating real world non-coding features into block IDEs", 
  number: 3,
  type: "position", 
  pdf: "p03_Streeter.pdf", 
  authors: [{first: "Mikala", 
             last: "Streeter", 
             email: "mpstreeter@gmail.com", 
             country: "United States of America", 
             org: "Georgia Tech"}
    ]
 }, 
 
 {title: "Pushing Blocks all the way to C++", 
  number: 4, 
  type: "paper", 
  pdf: "p04_Protzenko.pdf", 
  authors: [{first: "Jonathan",
             last: "Protzenko", 
             email: "protz@microsoft.com",
             country: "United States of America", 
             org: "Microsoft Research"}
    ]
 },

 {title: "Robotics Rule-Based Formalism to Specify Behaviors in a Visual Programming Environment", 
  number: 5, 
  type: "position", 
  pdf: "p05_Marghitu.pdf", 
  authors: [{first: "Daniela", 
             last: "Marghitu", 
             email: "marghda@auburn.edu", 
             country: "United States of America",
             org: "Auburn University"}, 
            {first: "Stephen", 
             last: "Coy", 
             email: "scoy@microsoft.com",
             country: "United States of America",
             org: "Microsoft FUSELABS"}
    ]
 }, 

 {title: "Programming Environments for Blocks Need First-Class Software Refactoring Support", 
  number: 8, 
  type: "position", 
  pdf: "p08_Techapalokul.pdf", 
  authors: [{first: "Peeratham", 
             last: "Techapalokul", 
             email: "tpeera4@vt.edu", 
             country: "United States of America",
             org: "Virginia Tech"}, 
            {first: "Eli", 
             last: "Tilevich", 
             email: "tilevich@cs.vt.edu", 
             country: "United States of America",
             org: "Virginia Tech"}
    ]
 }, 

 {title: "Blocks Versus Text: Ongoing Lessons from Bootstrap", 
  number: 10, 
  type: "position", 
  pdf: "p10_Schanzer.pdf", 
  authors: [{first: "Emmanuel", 
             last: "Schanzer", 
             email: "schanzer@bootstrapworld.org", 
             country: "United States of America", 
             org: "Bootstrap"}, 
            {first: "Shriram", 
             last: "Krishnamurthi", 
             email: "sk@cs.brown.edu", 
             country: "United States of America", 
             org: "Brown University"}, 
            {first: "Kathi", 
             last: "Fisler", 
             email: "kfisler@cs.wpi.edu", 
             country: "United States of America", 
             org: "WPI"}
    ]
 },

 {title: "A Module System for a General-Purpose Blocks Language", 
  number: 11, 
  type: "paper", 
  pdf: "p11_Ohshima.pdf", 
  authors: [{first: "Yoshiki", 
             last: "Ohshima", 
             email: "Yoshiki.Ohshima@acm.org",
             country: "Japan",
             org: "Communications Design Group, SAP Labs"}, 
            {first: "John", 
             last: "Maloney", 
             email: "jmaloney@media.mit.edu",
             country: "United States of America",
             org: "Communications Design Group, SAP Labs"}, 
            {first: "Jens", 
             last: "Mönig", 
             email: "jens@moenig.org", 
             country: "Germany",
             org: "Communications Design Group, SAP Labs"}
    ]
 },

 {title: "From Interest to Usefulness with BlockPy, a Block-based, Educational Environment", 
  number: 12, 
  type: "position", 
  pdf: "p12_Bart.pdf", 
  authors: [{first: "Austin", 
             last: "Bart", 
             email: "acbart@vt.edu",
             country: "United States of America", 
             org: "Virginia Tech"}, 
            {first: "Eli", 
             last: "Tilevich",
             email: "tilevich@cs.vt.edu",
             country: "United States of America",
             org: "Virginia Tech"}, 
            {first: "Cliff", 
             last: "Shaffer", 
             email: "shaffer@cs.vt.edu", 
             country: "United States of America", 
             org: "Virginia Tech"}, 
            {first: "Dennis", 
             last: "Kafura", 
             email: "kafura@vt.edu", 
             country: "United States of America", 
             org: "Virginia Tech"}
    ]
 }, 

 {title: "Online Community Members as Mentors for Novice Programmers", 
  number: 13, 
  type: "position", 
  pdf: "p13_Ichinco.pdf", 
  authors: [{first: "Michelle", 
             last: "Ichinco", 
             email: "michelle.ichinco@wustl.edu", 
             country: "United States of America", 
             org: "Washington University in St. Louis"}, 
            {first: "Caitlin", 
             last: "Kelleher", 
             email: "ckelleher@wustl.edu", 
             country: "United States of America", 
             org: "Washington University in St. Louis"}
    ]
 }, 

 {title: "Transparency and Liveness in Programming Environments for Novices", 
  number: 15, 
  type: "position", 
  pdf: "p15_Tanimoto.pdf", 
  authors: [{first: "Steven", 
             last: "Tanimoto", 
             email: "tanimoto@cs.washington.edu", 
             country: "United States of America", 
             org: "University of Washington"}
    ]
 },

 {title: "Lambda in Blocks Languages: Lessons Learned", 
  number: 16, 
  type: "position", 
  pdf: "p16_Harvey.pdf", 
  authors: [{first: "Brian", 
             last: "Harvey", 
             email: "bh@cs.berkeley.edu", 
             country: "United States of America", 
             org: "University of California, Berkeley"}, 
            {first: "Jens", 
             last: "Mönig", 
             email: "jens@moenig.org", 
             country: "Germany", 
             org: "SAP SE"}
    ]
 }, 

 {title: "Visual Debugging Technology with Pencil Code", 
  number: 18, 
  type: "position", 
  pdf: "p18_Boss.pdf", 
  authors: [{first: "Amanda", 
             last: "Boss", 
             email: "aboss@college.harvard.edu", 
             country: "United States of America", 
             org: "Harvard College"}, 
            {first: "Cali", 
             last: "Stenson", 
             email: "cstenson@wellesley.edu",
             country: "United States of America", 
             org: "Wellesley College"}, 
            {first: "Jeremy", 
             last: "Ruten", 
             email: "jeremy.ruten@gmail.com", 
             country: "Canada", 
             org: "University of Saskatchewan"}
    ]
 }, 

 {title: "Lack of Keyboard Support Cripples Block-Based Programming", 
  number: 19, 
  type: "position", 
  pdf: "p19_Brown.pdf", 
  authors: [{first: "Neil", 
             last: "Brown", 
             email: "N.C.C.Brown@kent.ac.uk", 
             country: "United Kingdom", 
             org: "University of Kent"}, 
            {first: "Michael", 
             last: "Kölling", 
             email: "m.kolling@kent.ac.uk", 
             country: "United Kingdom", 
             org: "University of Kent"}, 
            {first: "Amjad", 
             last: "Altadmri", 
             email: "amjad.altadmri@gmail.com", 
             country: "United Kingdom", 
             org: "University of Kent"}
    ]
 },

 {title: "Approaches for Teaching Computational Thinking Strategies in an Educational Game", 
  number: 21, 
  type: "position", 
  pdf: "p21_Bauer.pdf", 
  authors: [{first: "Aaron", 
             last: "Bauer", 
             email: "awb@cs.washington.edu", 
             country: "United States of America", 
             org: "University of Washington"}, 
           {first: "Eric", 
            last: "Butler", 
            email: "edbutler@cs.washington.edu", 
            country: "United States of America", 
            org: "University of Washington"}, 
           {first: "Zoran", 
            last: "Popovic", 
            email: "zoran@cs.washington.edu", 
            country: "United States of America", 
            org: "University of Washington"}
    ]
 }, 

 {title: "The Impact of Distractors in Programming Completion Puzzles on Novice Programmers", 
  number: 23, 
  type: "position",
  pdf: "p23_Harms.pdf", 
  authors: [{first: "Kyle", 
             last: "Harms", 
             email: "kyle.harms@wustl.edu", 
             country: "United States of America", 
             org: "Washington University in St. Louis"}
    ]
 }, 

 {title: "Middle School Experience with Visual Programming Environments", 
  number: 24, 
  type: "paper", 
  pdf: "p24_Walters.pdf", 
  authors: [{first: "Barbara", 
             last: "Walters", 
             email: "barbara.walters@vanbara.com", 
             country: "United States of America", 
             org: "vanbara, Inc."}, 
            {first: "Vicki", 
             last: "Jones", 
             email: "vicki.jones423@gmail.com", 
             country: "United States of America", 
             org: "vanbara, Inc."}
    ]
 }, 

 {title: "App Inventor Instructional Resources for Creating Tangible Apps", 
  number: 25, 
  type: "position", 
  pdf: "p25_Roy.pdf", 
  authors: [{first: "Krishnendu", 
             last: "Roy", 
             email: "kroy@valdosta.edu", 
             country: "United States of America", 
             org: "Valdosta State University"}
    ]
 }, 

 {title: "Quizly: A Live Coding Assessment Platform for App Inventor", 
  number: 26, 
  type: "paper", 
  pdf: "p26_Maiorana.pdf", 
  authors: [{first: "Francesco", 
             last: "Maiorana", 
             email: "fmaioran@gmail.com", 
             country: "Italy", 
             org: "University of Catania"}, 
            {first: "Daniela",
             last: "Giordano", 
             email: "daniela.giordano@dieei.unict.it", 
             country: "Italy", 
             org: "University of Catania"}, 
            {first: "Ralph", 
             last: "Morelli", 
             email: "ralph.morelli@trincoll.edu", 
             country: "United States of America", 
             org: "Trinity College, Hartford, CT"}
    ]
 }, 

 ]

 

 
  