$(document).ready(function(){

	//check to see if any articles exist in the database
	$.ajax({
		method: "GET",
		url: "/articles"
	}).then(function(data){
		//setup a certain div if no articles
		if(data.length === 0){
			var div = $("<div></div>").attr("id", "no-articles").append("<h1>No Articles</h1>");
			$("#article-container").append(div);
		}
		else{
			$("#no-articles").hide();
			data.forEach(article=>{
				//create a div for each article
				var div = $("<div></div>").attr("id", "article").append("<h1>" + article.title +"</h1>");
				$("#article-container").append(div);
			})
		}
		console.log(data);
		
	}).catch(function(err){

	});

	//scrape the articles
	$("#scrape").click(function(){
		//ajax call
		$.ajax({
			method: "GET",
			url: "/scrape"
		}).then(function(data){

			location.reload();

		}).catch(function(err){
			console.log(err);
		});
	});
});