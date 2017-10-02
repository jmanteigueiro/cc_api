<!doctype html>
<html>
  <head>
    <title>Hello World!</title>
    <script src="./pagesjs/jquery-3.2.1.min.js"></script>
  </head>
  <body>
  <script>
    $(function(){ // jQuery DOM ready
        url = '/getCartao'
        $.get(url, function (data) {
          var rawData = JSON.parse(data);
          var cardType = rawData[0]; 
          document.body.append(cardType);

          var photo = document.createElement("img");
          photo.src = "../images/photo.jp2";

          var src = document.body.append(photo);
        });

    });
  </script>
	<?php
	require('./imagemagick.php');
	?>
  </body>
</html>
