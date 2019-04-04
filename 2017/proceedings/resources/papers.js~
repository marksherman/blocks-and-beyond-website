// [lyn, 09/16/15] Wrote this paper list generation JavaScript magic

var countryAbbreviations = {"United States of America":"USA", "United Kingdom":"UK"};
function countryName(country) {
  abbrev = countryAbbreviations[country];
  return abbrev ? abbrev : country; // If there's an abbreviation, return it; otherwise return original string
}

var noiseWords = ["a", "an", "the"]

function removeNoiseWords (title) {
  return title.split(" ").filter(function (word) { return noiseWords.indexOf(word.toLowerCase()) == -1; }).join(" ");
}

function comparePaperTitles (paper1, paper2) {
  var noiseless1 = removeNoiseWords(paper1.title);
  var noiseless2 = removeNoiseWords(paper2.title);
  if (noiseless1 < noiseless2) {
    return -1;
  } else if (noiseless1 > noiseless2) {
    return 1;
  } else {
    return 0;
  }
}

function compareNumbers (num1, num2) {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  } else {
    return 0;
  }
}

function paperType(paper) {
  if (paper.type == "paper") {
    return "paper";
  } else if (paper.type == "position") {
    return "position";
    // return "position statement";
  } else {
    throw "Unexpected type of paper: " + paper.type
  }
}

function padDigits(i) {
  var str = i.toString();
  if (str.length == 1) {
    return "00" + str;
  } else if (str.length == 2) {
    return "0" + str;
  } else {
    return str;
  }
}

function pdfName(paper) {
  var firstAuthorLastName = paper.authors[0].last.toLowerCase()
                            .split(" ").join("") // Remove any spaces
                            .replace("í", "i") // Replace unicode
                            .replace("á", "a")
                            .replace("ö", "oe");
  if (firstAuthorLastName == "marghitu") {
    return "p045-marghitu-corrected.pdf";
  } else {
    var pageNum = "p" + padDigits(paper.page);
    return pageNum + "-" + firstAuthorLastName + ".pdf";
  }
}

function forEach (elts, fcn) { // Apply function fcn to each element of elts, from first to last
  for (var i = 0; i < elts.length; i++) {
    fcn(elts[i]);
  }
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
      .attr("href", "pdf-proceedings/" + pdfName(paper))
      .html(paper.title);
    forEach(paper.authors, function (author) { addAuthor(author); }); 
    paperEntry.appendTo(listId);
  }
  forEach(papers, function (paper) { addEntry(paper, "#paperList"); } );
  forEach(positions, function (position) { addEntry(position, "#positionList"); } );
  /* 
     for (var i = 0; i < papers.length; i++) {
    addEntry(papers[i], "#paperList");
  }
  */
  /* 
     for (var i = 0; i < positions.length; i++) {
     addEntry(positions[i], "#positionList");
  }
  */

}

function addPapersByAuthor() {
  var authorDict = {};
  // Populate authorDict with all papers for each author
  forEach(allPapers, function (paper) { 
      forEach(paper.authors, function (author) {
          var authorKey = author.last + "," + author.first;
          if (! authorDict[authorKey]) {
            authorDict[authorKey] = [paper]; 
          } else {
            authorDict[authorKey].push(paper);
          }
        });
    });
  var allAuthorKeys = Object.keys(authorDict);
  allAuthorKeys.sort(); // Sort by last name first
  forEach(allAuthorKeys, function (authorKey) {
      var authorIndexEntry = $('#template > .authorIndexEntry').clone();
      var lastFirstList = authorKey.split(",");
      var firstName = lastFirstList[1];
      var lastName = lastFirstList[0];
      authorIndexEntry.find(".authorIndexAuthor").html(firstName + " " + lastName);
      var papersOfAuthor = authorDict[authorKey];
      // Sort multiple papers of an author by title
      papersOfAuthor.sort(comparePaperTitles); 
      // Now add all papers for each author to page
      forEach(papersOfAuthor, function (paper) { 
          var paperEntry = $('#template > .authorIndexPaperEntry').clone();
          paperEntry.find(".paperTitle > a")
            .attr("href", "pdf-proceedings/" + pdfName(paper))
            .html(paper.title);
          paperEntry.find(".paperType").html(paperType(paper));
          forEach(paper.authors, function (author) {
              var authorEntry = $('#template > .authorEntry').clone();
              authorEntry.find(".authorName").html(author.first + " " + author.last);
              orgPlusCountry = author.org + ", " + countryName(author.country);
              authorEntry.find(".orgName").html(orgPlusCountry);
              authorEntry.appendTo(paperEntry.find(".authorList"));
            });
          paperEntry.appendTo(authorIndexEntry.find(".authorIndexPaperList"));
        });
      authorIndexEntry.appendTo("#authorIndexList");
    });
}

function printPapersByAuthorLatex() {
  var authorDict = {};
  // Populate authorDict with all papers for each author
  forEach(allPapers, function (paper) { 
      forEach(paper.authors, function (author) {
          var authorKey = author.last + "," + author.first;
          if (! authorDict[authorKey]) {
            authorDict[authorKey] = [paper]; 
          } else {
            authorDict[authorKey].push(paper);
          }
        });
    });
  var allAuthorKeys = Object.keys(authorDict);
  allAuthorKeys.sort(); // Sort by last name first
  forEach(allAuthorKeys, function (authorKey) {
      var lastFirstList = authorKey.split(",");
      var firstName = lastFirstList[1];
      var lastName = lastFirstList[0];
      var papersOfAuthor = authorDict[authorKey];
      var pagesOfPapers = papersOfAuthor.map(function (paper) { return paper.page; });
      pagesOfPapers.sort(compareNumbers);
      console.log("\\bbIndexedAuthor{" + lastName + "}{" + firstName + "}{"
                  + pagesOfPapers.join(", ") + "}");
    });
}

// Hardwire this in correct order
var allSessions = ["assessment", "blocksDesign", "structuredEditing", "newDomains", "newFeatures", "pedagogy"];

var sessionNames = {
  "assessment": "Assessment of Learning with Blocks Languages", 
  "blocksDesign": "Blocks Language Design", 
  "structuredEditing": "Blocks, Text, and Structured Editing",
  "newDomains": "New Domains for Blocks Languages", 
  "newFeatures": "New Features for Blocks Environments",
  "pedagogy": "Pedagogy of Blocks Languages"
}

function addPapersBySession() {
  var sessionDict = {};
  // Populate authorDict with all papers for each author
  forEach(allPapers, function (paper) { 
      if (! sessionDict[paper.session]) {
            sessionDict[paper.session] = [paper]; 
          } else {
            sessionDict[paper.session].push(paper);
          }
    });
  // var allSessionKeys = Object.keys(sessionDict);
  forEach(allSessions, function (session) {
      var sessionPapers = sessionDict[session];
      // Sort multiple papers of an author by title
      sessionPapers.sort(comparePaperTitles);
      forEach(sessionPapers, function (paper) { 
          var paperEntry = $('#template > .paperEntry').clone();
          paperEntry.find(".paperTitle > a")
            .attr("href", "pdf-proceedings/" + pdfName(paper))
            .html(paper.title);
          paperEntry.find(".paperType").html(paperType(paper));
          forEach(paper.authors, function (author) {
              var authorEntry = $('#template > .authorEntry').clone();
              authorEntry.find(".authorName").html(author.first + " " + author.last);
              orgPlusCountry = author.org + ", " + countryName(author.country);
              authorEntry.find(".orgName").html(orgPlusCountry);
              authorEntry.appendTo(paperEntry.find(".authorList"));
            });
          paperEntry.appendTo("#" + session + "List");
        });
    });
}

function printPapersBySessionLatex() {
  var sessionDict = {};
  // Populate authorDict with all papers for each author
  forEach(allPapers, function (paper) { 
      if (! sessionDict[paper.session]) {
            sessionDict[paper.session] = [paper]; 
          } else {
            sessionDict[paper.session].push(paper);
          }
    });
  // var allSessionKeys = Object.keys(sessionDict);
  forEach(allSessions, function (session) {
      console.log("\\bbSession{" + sessionNames[session] + "}\n"); 
      var sessionPapers = sessionDict[session];
      // Sort multiple papers of an author by title
      sessionPapers.sort(comparePaperTitles);
      forEach(sessionPapers, function (paper) { 
          console.log("\\bbTitle{" + paper.title 
                      + "}{" + paper.type.toUpperCase() 
                      + "}{" + paper.page + "}"); 
          forEach(paper.authors, function (author) {
              console.log("\\bbAuthor{" + author.first + " " + author.last 
                          + "}{" + author.org + ", " + countryName(author.country) + "}");
            });
        });
    });
}


// JSON describing all papers
allPapers = 
[
 {title: "Ten Things We've Learned from Blockly", 
  number: 1, 
  type: "position", 
  pdf: "p01_Fraser.pdf",
  session: "blocksDesign", 
  page: 49, 
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
  session: "newDomains", 
  page: 77, 
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

 {title: "Incorporating Real World Non-coding Features into Block IDEs", 
  number: 3,
  type: "position", 
  pdf: "p03_Streeter.pdf", 
  session: "newFeatures",
  page: 103, 
  authors: [{first: "Mikala", 
             last: "Streeter", 
             email: "mpstreeter@gmail.com", 
             country: "United States of America", 
             org: "Georgia Tech"}
    ]
 }, 
 
 {title: "Pushing Blocks All the Way to C++", 
  number: 4, 
  type: "paper", 
  session: "newDomains", 
  pdf: "p04_Protzenko.pdf", 
  page: 91, 
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
  session: "blocksDesign", 
  page: 45, 
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
  session: "newFeatures",
  page: 109, 
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
  session: "pedagogy", 
  page: 125, 
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
  page: 39, 
  session: "blocksDesign", 
  authors: [{first: "Yoshiki", 
             last: "Ohshima", 
             email: "Yoshiki.Ohshima@acm.org",
             country: "United States of America", 
             org: "Communications Design Group, SAP Labs/Viewpoints Research Institute"}, 
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
  session: "newDomains", 
  page: 87, 
  authors: [{first: "Austin Cory", 
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
  session: "newFeatures",
  page: 105, 
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
  session: "newFeatures",
  page: 113, 
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
  session: "blocksDesign", 
  page: 35, 
  authors: [{first: "Brian", 
             last: "Harvey", 
             email: "bh@cs.berkeley.edu", 
             country: "United States of America", 
             org: "University of California, Berkeley"}, 
            {first: "Jens", 
             last: "Mönig", 
             email: "jens@moenig.org", 
             country: "Germany", 
             org: "Communications Design Group, SAP Labs"}
    ]
 }, 

 {title: "Visual Debugging Technology with Pencil Code", 
  number: 18, 
  type: "position", 
  pdf: "p18_Boss.pdf", 
  session: "newFeatures",
  page: 115, 
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
  session: "structuredEditing",
  page: 59, 
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
  session: "pedagogy", 
  page: 121, 
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
            last: "Popović", 
            email: "zoran@cs.washington.edu", 
            country: "United States of America", 
            org: "University of Washington"}
    ]
 }, 

 {title: "The Impact of Distractors in Programming Completion Puzzles on Novice Programmers", 
  number: 23, 
  type: "position",
  pdf: "p23_Harms.pdf", 
  session: "assessment", 
  page: 9, 
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
  session: "pedagogy", 
  page: 133, 
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
  session: "pedagogy",  
  page: 119, 
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
  session: "assessment", 
  page: 25, 
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
             org: "Trinity College"}
    ]
 }, 

 {title: "Towards Making Block-Based Programming Accessible for Blind Users", 
  number: 27, 
  type: "position", 
  pdf: "p27_Ludi.pdf", 
  session: "structuredEditing",
  page: 67,
  authors: [{first: "Stephanie", 
             last: "Ludi", 
             email: "salvse@rit.edu", 
             country: "United States of America", 
             org: "Rochester Institute of Technology"}
    ]
 }, 

 {title: "The Challenges of Studying Blocks-based Programming Environments", 
  number: 28, 
  type: "paper", 
  pdf: "p28_Weintrop.pdf", 
  session: "assessment", 
  page: 5, 
  authors: [{first: "David", 
             last: "Weintrop", 
             email: "dweintrop@u.northwestern.edu", 
             country: "United States of America", 
             org: "Northwestern University"}, 
            {first: "Uri", 
             last: "Wilensky", 
             email: "uri@northwestern.edu", 
             country: "United States of America", 
             org: "Northwestern University"}
    ]
 },

 {title: "Design of a Blocks-Based Environment for Introductory Programming in Python", 
  number: 29, 
  type: "paper", 
  pdf: "p29_Poole.pdf", 
  session: "blocksDesign", 
  page: 31, 
  authors: [{first: "Matthew", 
             last: "Poole", 
             email: "matthew.poole@port.ac.uk", 
             country: "United Kingdom", 
             org: "University of Portsmouth"}
    ]
 }, 

 {title: "Assessing Knowledge in Blocks-Based and Text-Based Programming Languages", 
  number: 30, 
  type: "position", 
  pdf: "p30_Morrison.pdf", 
  session: "assessment", 
  page: 1, 
  authors: [{first: "Briana", 
             last: "Morrison", 
             email: "bmorrison@gatech.edu", 
             country: "United States of America", 
             org: "Georgia Tech"}
    ]
 }, 

 {title: "Profiling Styles of Use in Alice: Identifying Patterns of Use by Observing Participants in Workshops with Alice", 
  number: 33, 
  type: "paper", 
  pdf: "p33_MoralesDiaz.pdf", 
  session: "assessment", 
  page: 19,
  authors: [{first: "Leonel Vinicio", 
             last: "Morales Díaz", 
             email:  "litomd@ufm.edu", 
             country: "Guatemala",  
             org: "Universidad Francisco Marroquín"}, 
            {first: "Laura Sanely", 
             last: "Gaytán-Lugo", 
             email: "laura@ucol.mx", 
             country: "Mexico", 
             org: "Universidad de Colima"}, 
            {first: "Lissette", 
             last: "Fleck",  
             email: "afleck@ufm.edu", 
             country: "Guatemala", 
             org: "Universidad Francisco Marroquín"}
    ]
 }, 

 {title: "Learning Analytics for the Assessment of Interaction with App Inventor", 
  number: 34, 
  type: "position", 
  pdf: "p34_Sherman.pdf", 
  session: "assessment", 
  page: 13, 
  authors: [{first: "Mark", 
             last: "Sherman", 
             email: "msherman@cs.uml.edu", 
             country: "United States of America", 
             org: "University of Massachusetts Lowell"}, 
            {first: "Fred", 
             last: "Martin", 
             email: "fredm@cs.uml.edu", 
             country: "United States of America", 
             org: "University of Massachusetts Lowell"}
    ]
 }, 

 {title: "Teaching and Learning through Creating Games in ScratchJr: Who Needs Variables Anyway!", 
  number: 36, 
  type: "position", 
  pdf: "p36_Thuzar.pdf", 
  session: "pedagogy", 
  page: 139, 
  authors: [{first: "Aye", 
             last: "Thuzar",
             email: "ayethuzar@gmail.com", 
             country: "United States of America", 
             org: "The Pingry School"}, 
            {first: "Aung", 
             last: "Nay", 
             email: "anay@zatna.com", 
             country: "United States of America", 
             org: "Zatna LLC"}
    ]
 },

 {title: "Java as a Second Language: Thoughts on a Linguistically-informed Transition to Typing Languages", 
  number: 38, 
  type: "position", 
  pdf: "p38_King.pdf", 
  session: "assessment", 
  page: 11, 
  authors: [{first: "Eileen", 
             last: "King", 
             email: "eking@lakesinternational.org", 
             country: "United States of America", 
             org: "Lakes International Language Academy"}
    ]
 }, 

 {title: "MUzECS: Embedded Blocks for Exploring Computer Science", 
  number: 39, 
  type: "paper", 
  pdf: "p39_Bajzek.pdf", 
  session: "pedagogy", 
  page: 127, 
  authors: [{first: "Matthew", 
             last: "Bajzek", 
             email: "matthew.bajzek@marquette.edu", 
             country: "United States of America", 
             org: "Marquette University"}, 
            {first: "Heather", 
             last: "Bort", 
             email: "heather.bort@marquette.edu", 
             country: "United States of America", 
             org: "Marquette University"}, 
            {first: "Omokolade", 
             last: "Hunpatin", 
             email: "omokolade.hunpatin@marquette.edu", 
             country: "United States of America", 
             org: "Marquette University"}, 
            {first: "Luke", 
             last: "Mivshek", 
             email: "luke.mivshek@marquette.edu", 
             country: "United States of America",
             org: "Marquette University"},
            {first: "Tyler", 
             last: "Much", 
             email: "tyler.much@marquette.edu",
             country: "United States of America", 
             org: "Marquette University"}, 
            {first: "Casey", 
             last: "O'Hare", 
             email: "caseyrohare@gmail.com", 
             country: "United States of America", 
             org: "Marquette University"}, 
            {first: "Dennis", 
             last: "Brylow", 
             email: "dennis.brylow@marquette.edu",
             country: "United States of America", 
             org: "Marquette University"}
    ]
 }, 

 {title: "Blocks at Your Fingertips: Blurring the Line Between Blocks and Text in GP", 
  number: 41, 
  type: "position", 
  pdf: "p41_Moenig.pdf", 
  session: "structuredEditing",
  page: 51,
  authors: [{first: "Jens", 
             last: "Mönig", 
             email: "jens@moenig.org", 
             country: "Germany", 
             org: "Communications Design Group, SAP Labs"}, 
           {first: "Yoshiki", 
            last: "Ohshima", 
            email: "Yoshiki.Ohshima@acm.org", 
            country: "United States of America", 
            org: "Communications Design Group, SAP Labs/Viewpoints Research Institute"}, 
           {first: "John", 
            last:  "Maloney", 
            email: "jmaloney@media.mit.edu", 
            country: "United States of America",  
            org: "Communications Design Group, SAP Labs"}
    ]
 }, 

 {title: "A Blocks-Based Editor for HTML Code", 
  number: 42, 
  type: "paper", 
  pdf: "p42_Aggarwal.pdf",   
  session: "newDomains", 
  page: 83, 
  authors: [{first: "Saksham", 
             last: "Aggarwal", 
             email: "saksham.aggarwal@students.iiit.ac.in", 
             country: "India", 
             org: "International Institute of Information Technology"}, 
            {first: "David Anthony", 
             last: "Bau", 
             email: "dab1998@gmail.com", 
             country: "United States of America",
             org: "Phillips Exeter Academy"}, 
            {first: "David", 
             last: "Bau", 
             email: "davidbau@mit.edu",
             country: "United States of America", 
             org: "Google and MIT"}
    ]
 }, 

 {title: "Integrating Droplet into Applab --- Improving The Usability of a Blocks-Based Text Editor", 
  number: 47, 
  type: "paper", 
  pdf: "p47_Bau.pdf", 
  session: "structuredEditing",
  page: 55, 
  authors: [{first: "David Anthony", 
            last: "Bau", 
            email: "dab1998@gmail.com", 
            country: "United States of America", 
            org: "Phillips Exeter Academy"}
    ]
 }, 

 {title: "Measuring Learning in an Open-Ended, Constructionist-Based Programming Camp: Developing a Set of Quantitative Measures from Qualitative Analysis", 
  number: 48, 
  type: "position", 
  pdf: "p48_Fields.pdf", 
  session: "assessment", 
  page: 15, 
  authors: [{first: "Deborah", 
            last: "Fields", 
            email: "deborah.fields@usu.edu", 
            country: "United States of America", 
            org: "Utah State University"}, 
           {first: "Lisa", 
            last: "Quirke", 
            email: "lisa.quirke@mail.utoronto.ca", 
            country: "Canada", 
            org: "University of Toronto"}, 
           {first: "Janell", 
            last: "Amely", 
            email: "jamely@aggiemail.usu.edu", 
            country: "United States of America", 
            org: "Utah State University"}
    ]
 }, 

 {title: "Block-based programming with Scratch community data: A position paper",
  // "Scratch Data Blocks: Providing an API to the Scratch online community from within Scratch", 
  number: 49,  
  type: "position", 
  pdf: "p49_Dasgupta.pdf", 
  session: "newDomains", 
  page: 97, 
  authors: [{first: "Sayamindu", 
            last: "Dasgupta", 
            email: "sayamindu@media.mit.edu", 
            country: "United States of America", 
            org: "MIT"}
    ]
 }, 

 {title: "Thinking in Blocks: Implications of using Abstract Syntax Trees as the underlying program model",
  number: 50, 
  type: "paper", 
  pdf: "p50_Wendel.pdf", 
  session: "structuredEditing",
  page: 63, 
  authors: [{first: "Daniel", 
            last: "Wendel", 
            email: "djwendel@mit.edu",
            country: "United States of America", 
            org: "MIT Scheller Teacher Education Program"}, 
           {first: "Paul", 
            last: "Medlock-Walton", 
            email: "paulmw@mit.edu",
            country: "United States of America", 
            org: "MIT Scheller Teacher Education Program"}
    ]
 }, 
  
 {title: "Block-Based Programming Abstractions for Explicit Parallel Computing", 
  number: 51, 
  type: "paper", 
  pdf: "p51_Feng.pdf", 
  session: "newDomains", 
  page: 71, 
  authors: [{first: "Annette", 
             last: "Feng", 
             email: "afeng@vt.edu", 
             country: "United States of America", 
             org: "Virginia Tech"}, 
            {first: "Eli", 
             last: "Tilevich", 
             email: "tilevich@cs.vt.edu", 
             country: "United States of America", 
             org: "Virginia Tech"}, 
           {first: "Wu-Chun", 
            last: "Feng", 
            email: "feng@cs.vt.edu", 
            country: "United States of America", 
            org: "Virginia Tech"}
    ]
 }, 

 {title: "Using Blocks to Get More Blocks: Exploring Linked Data through Integration of Queries and Result Sets in Block Programming", 
  number: 52, 
  type: "paper", 
  pdf: "p52_Bottoni.pdf", 
  session: "newDomains", 
  page: 99, 
  authors: [{first: "Paolo", 
             last: "Bottoni", 
             email: "bottoni@di.uniroma1.it", 
             country: "Italy", 
             org: "Sapienza University of Rome"}, 
            {first: "Miguel", 
             last: "Ceriani", 
             email: "ceriani@di.uniroma1.it", 
             country: "Italy", 
             org: "Sapienza University of Rome"}
    ]
 }

 ]

 

 
  
