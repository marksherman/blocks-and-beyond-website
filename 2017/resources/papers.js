// [lyn, 09/28/15] Adpated for Blocks & Beyond 2017
// [lyn, 09/16/15] Wrote this paper list generation JavaScript magic for Blocks & Beyond 2015

var demoPosterPapers = 
  [
   "p103-brand.pdf", 
   "p105-broll.pdf", 
   "p107-holwerda.pdf", 
   "p109-lao.pdf", 
   "p111-malysheva.pdf", 
   "p113-millner.pdf", 
   "p115-rough.pdf",
   "p117-svanberg.pdf"
   /*
   "s40-malysheva.pdf", 
   "s41-svanberg.pdf", 
   "s42-broll.pdf",
   "s45-holwerda.pdf", 
   "s46-lao.pdf", 
   "s47-millner.pdf", 
   "s48-rough.pdf", 
   "s50-brand.pdf" 
   */
   ];

function isDemoPoster(paper) {
  type = paper.type;
  return type == "demo" || type == "poster" || type == "poster-and-demo";
}

function hasPDF(paper) {
  return !isDemoPoster(paper) || demoPosterPapers.indexOf(pdfName(paper)) != -1;
}

function pdfLinkTitle(paper) {
  var word = isDemoPoster(paper) ? 'Summary' : (paper.type == 'paper' ? 'Full Paper' : 'Position Statement'); 
  return 'Link to ' + word + ' PDF'; 
}

function authorName(author) {
  return author["first name"] + " " + author["last name"];
}

function commaSeparatedList(strings) {
  return strings.join(', ');
}

function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

function parBreakAtTwoNewlines(s) {
  // modify string s so that \n\n and \r\n\r\n are converted to <br><br>
  return s.replace(/\n\n/g, '<br><br>').replace(/\r\n\r\n/g, '<br><br>')
}

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

function compareBySessionOrder (paper1, paper2) {
  if (! (paper1.sessionOrder && paper2.sessionOrder)) {
    return 0;
  } else {
    // both session orders exists
    return paper1.sessionOrder - paper2.sessionOrder;
  }
}

function paperType(paper) {
  return paper.type == "poster-and-demo" ? "poster&demo" : paper.type
  /*
  if (paper.type == "paper") {
    return "paper";
  } else if (paper.type == "position") {
    return "position";
    // return "position statement";
  } else {
    throw "Unexpected type of paper: " + paper.type
  }
  */
}

function padDigits(i,len) {
  var str = isString(i) ? i : i.toString();
  while (str.length < len) {
    str = '0' + str;
  }
  return str;
}

function pdfName(paper) {
  if (! paper.page) {
    return "";
  } else {
    var firstAuthorLastName = paper.authors[0]["last name"].toLowerCase()
                              .split(" ").join("") // Remove any spaces
                              .replace("í", "i") // Replace unicode
                              .replace("á", "a")
                              .replace("ö", "oe");
    var pageNum = "p" + padDigits(paper.page,3);
    return pageNum + "-" + firstAuthorLastName + ".pdf";
  }
  /* Version at workshop: 
  return 's' + padDigits(paper.ID,2) + "-" 
         + firstAuthorLastName + ".pdf";
  */
  /*
  if (firstAuthorLastName == "marghitu") {
    return "p045-marghitu-corrected.pdf";
  } else {
    var pageNum = "p" + padDigits(paper.page,3);
    return pageNum + "-" + firstAuthorLastName + ".pdf";
  }
  */
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

function addEntry (paper, listId, type) {
  var paperEntry = $('#template > .paperEntry').clone();
  function addAuthor (author, authorListElt) {
    var authorEntry = $('#template > .authorEntry').clone();
    authorEntry.find(".authorName").html(authorName(author))
    orgPlusCountry = author.organization + ", " + countryName(author.country);
    authorEntry.find(".orgName").html(orgPlusCountry);
    authorEntry.appendTo(paperEntry.find(".authorList"));
  } 
  paperEntry.find(".paperTitleSpan")
    //.attr("href", "pdf-proceedings/" + pdfName(paper))
    // .html('#' + paper.ID + ' ' + paper.title);
    .html(paper.title);
  paperEntry.find(".paperType").html(paperType(paper));
  paperEntry.find(".paperInfoGroup").attr('id', 'paperInfo#' + paper.ID + type);
  var keywords = paper.keywords;
  if (keywords.length != 0) {
    paperEntry.find(".keywords").html(commaSeparatedList(keywords));
  } else {
    // console.log("hiding keywords for " + paper.title);
    paperEntry.find(".keywordsInfo").hide();
  }
  // paperEntry.find(".keyphrases").html(commaSeparatedList(paper.keyphrases));
  paperEntry.find(".abstract").html(parBreakAtTwoNewlines(paper.abstract));
  if ((paper.type == 'poster-and-demo') && (type == "demo" || type == "poster")) {
    paperEntry.find(".posterDemoNote").html('(also a ' + (type == 'demo'? 'poster' : 'demo') + ')')
  }
  if (hasPDF(paper)) {
    paperEntry.find(".pdfLinkTitle")
      .html(pdfLinkTitle(paper))
    paperEntry.find(".pdfLink > a")
      .attr("href", "pdfs/" + pdfName(paper));
  } else {
    paperEntry.find(".pdfLink").hide();
  }
  forEach(paper.authors, function (author) { addAuthor(author); }); 
  paperEntry.appendTo(listId);
  paperEntry.find(".moreLessButton")
    .attr('paperid', paper.ID)
    .click(function () {
        paperID = $(this).attr('paperid'); 
        var current = $(this).html();
        paperInfoDiv = document.getElementById('paperInfo#' + paper.ID + type);
        if (current == "More Info") {
          $(this).html("Less Info");
          // console.log($('paperInfo#' + paper.ID + type))
          // $('paperInfo#' + paper.ID + type).show();
          paperInfoDiv.style.display = "block";
        } else {
          $(this).html("More Info");
          //console.log($('paperInfo#' + paper.ID + type))
          //$('paperInfo#' + paper.ID + type).hide();
          paperInfoDiv.style.display = "none";
        }
      });
};

function addPapersByType() {
  papers = allPapers.filter(function(p) { return p.type == "paper"; });
  papers.sort(compareByFirstAuthorName);
  positions = allPapers.filter(function(p) { return p.type == "position"; });
  positions.sort(compareByFirstAuthorName);
  posters = allPapers.filter(function(p) { 
      return p.type == "poster" || p.type == "poster-and-demo";
    });
  posters.sort(compareByFirstAuthorName);
  demos = allPapers.filter(function(p) { 
      return p.type == "demo" || p.type == "poster-and-demo";
    });
  demos.sort(compareByFirstAuthorName);

  forEach(papers, function (paper) { addEntry(paper, '#paperList', 'paper'); } );
  forEach(positions, function (position) { addEntry(position, '#positionList', 'position'); } );
  forEach(posters, function (p) { addEntry(p, '#posterList', 'poster'); } );
  forEach(demos, function (p) { addEntry(p, '#demoList', 'demo'); } );
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
var allSessions2015 = ["assessment", "blocksDesign", "structuredEditing", "newDomains", "newFeatures", "pedagogy"];

var sessionNames2015 = {
  "assessment": "Assessment of Learning with Blocks Languages", 
  "blocksDesign": "Blocks Language Design", 
  "structuredEditing": "Blocks, Text, and Structured Editing",
  "newDomains": "New Domains for Blocks Languages", 
  "newFeatures": "New Features for Blocks Environments",
  "pedagogy": "Pedagogy of Blocks Languages"
}

var sessionNames2017 = {
  "visualLanguage": "Visual Language Design", 
  "newDomains": "Blocks in New Domains", 
  "newFeatures": "New Features for Blocks Environments",
  "education": "Educational Aspects of Blocks",
  "playground1": "Blocks Playground 1: Posters and Demos",
  "playground2": "Blocks Playground 2: Posters and Demos"
  // "invitedPanel": "Invited Panel: The Future of Blocks Programming"
}

function addPapersBySession() {
  var sessionDict = {};
  // Populate sessionDict with all papers for each session
  forEach(allPapers, function (paper) { 
      if (! sessionDict[paper.session]) {
            sessionDict[paper.session] = [paper]; 
          } else {
            sessionDict[paper.session].push(paper);
          }
    });
  sessionNames = Object.keys(sessionNames2017);
  // var allSessionKeys = Object.keys(sessionDict);
  forEach(sessionNames, function (sessionName) {
      var sessionPapers = sessionDict[sessionName];

      // Sort papers first by titles
      //console.log(sessionPapers);
      sessionPapers.sort(comparePaperTitles);

      // Now (by stable sort) sort by session order (if it exists)
      // Papers will still be sorted by title if no session order declared. 
      sessionPapers.sort(compareBySessionOrder);

      forEach(sessionPapers, function (paper) { 
          sessionID = '#' + sessionName + "Session";
          //console.log(sessionID);
          addEntry(paper, sessionID, sessionName);
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
      //console.log("\\bbSession{" + sessionNames[session] + "}\n"); 
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

// Make the button with id buttonId a show/hide button for the div with id divId.                                                   
// "Show " + buttonText appears on the button when the div is hidden;                                                               
// "Hide "+ buttonText appears on the button when the div is shown;                                                                 
// showDivInitially is a boolean that controls whether div is shown initially.                                                      
function makeButtonShowHide (buttonId, divId, buttonText, showDivInitially) {
  var buttonElt = document.getElementById(buttonId);
  var divElt = document.getElementById(divId);
  var showText = "Show " + buttonText;
  var hideText = "Hide " + buttonText;
  function show() {
    buttonElt.innerHTML = hideText;
    divElt.style.display = "block";
  }
  function hide() {
    buttonElt.innerHTML = showText;
    divElt.style.display = "none";
  }
  if (showDivInitially) {
    show();
  } else {
    hide();
  }
  buttonElt.onclick = function () {
    if (buttonElt.innerHTML == showText) {
      show();
    } else {
      hide();
    }
  }
}

invitedPanelMoreLess = function () {
  thisButton = document.getElementById("invitedPanelMoreLessButton")
  current = thisButton.innerHTML;
  paperInfoDiv = document.getElementById("paperInfoInvitedPanel")
  if (current == "More Info") {
    thisButton.innerHTML = "Less Info";
    paperInfoDiv.style.display = "block";
  } else {
    thisButton.innerHTML = "More Info";
    paperInfoDiv.style.display = "none";
  }
}


