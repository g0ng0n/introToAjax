
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $( "#street" ).val();
    var city = $( "#city" ).val();
    var url = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+street+","+city;

    // YOUR CODE GOES HERE!
    $greeting.text=('So, you want to live at +' + street +", " + city +'?' );
    $body.append('<img class="bgimg" src='+url+'>');

    //http://api.nytimes.com/svc/search/v2/articlesearch.response-format?[q=search term&fq=filter-field:(filter-term)&additional-params=values]&api-key=####

    var nyTimesBaseUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
    var settingsUrlInfo= "&page=2&sort=oldest&api-key="
    var nyAPIkey ="305b81ba8073a6dbe3e592f398c1eb1c:1:73074827";

    var nyTimesFinalURL = nyTimesBaseUrl+city+settingsUrlInfo+nyAPIkey;

    $.getJSON(nyTimesFinalURL, function(data) {


        console.log(data);
        $nytHeaderElem.text('New York Times Articles About ' + city);

        articles = data.response.docs;

        for(var i =0; i <articles.length; i++)
        {
          var article = articles[i];

            $nytElem.append('<li class="article">' +
                    '<a href="'+article.web_url+'">'+
                    article.headline.main+
                    '</a>'+
                    '</p>'+ article.snippet +'</p>'+
                    '</li>'
            );
        };
    }).error(function() {
        $nytHeaderElem.text('New York Times Articles Could not be loaded ' + city);
    });

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city +'&format=json&callback=wikiCallback';

    //after 9 secs gone by the ajax request change the wikiElem to the text below
    var wikiRequestTimeout= setTimeout(function() {
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        //jsonp:"callback"

        success: function (response){
            var articleList = response[1];

            for (var i =0; i< articleList.length; i++){
                var articleStr =articleList[i];

                var url = 'http://en.wikipedia.org/wiki/' + articleStr;

                $wikiElem.append('<li><a href="'+url+ '">' +
                    articleStr + '</a></li>'
                );
            }

            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#form-container').submit(loadData);

// loadData();
