// [lyn, 09/28/15] Adpated for Blocks & Beyond 2017
// [lyn, 09/16/15] Wrote this paper list generation JavaScript magic for Blocks & Beyond 2015

function authorName(author) {
  return author["first name"] + " " + author["last name"];
}

function commaSeparatedList(strings) {
  return strings.join(', ');
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
      authorEntry.find(".authorName").html(authorName(author))
      orgPlusCountry = author.organization + ", " + countryName(author.country);
      authorEntry.find(".orgName").html(orgPlusCountry);
      authorEntry.appendTo(paperEntry.find(".authorList"));
    } 
    paperEntry.find(".paperTitle > a")
      //.attr("href", "pdf-proceedings/" + pdfName(paper))
      .html('#' + paper.ID + ' ' + paper.title);
    paperEntry.find(".paperInfoGroup").attr('id', 'paperInfo#' + paper.ID);
    paperEntry.find(".keywords").html(commaSeparatedList(paper.keywords));
    paperEntry.find(".keyphrases").html(commaSeparatedList(paper.keyphrases));
    paperEntry.find(".abstract").html(paper.abstract);
    forEach(paper.authors, function (author) { addAuthor(author); }); 
    paperEntry.appendTo(listId);
    paperEntry.find(".moreLessButton")
      .attr('paperid', paper.ID)
      .click(function () {
          paperID = $(this).attr('paperid'); 
          paperInfoDiv = document.getElementById('paperInfo#' + paperID); 
          var current = this.innerHTML;
          if (current == "More Info") {
            this.innerHTML = "Less Info";
            paperInfoDiv.style.display = "block";
          } else {
            this.innerHTML = "More Info";
            paperInfoDiv.style.display = "none";
          }
        });
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


