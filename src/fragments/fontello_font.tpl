$fontello_name: "bjsmc";

@font-face {
  font-family: $fontello_name;
  src: url('bjsmc-ie8.eot?') format('eot') local($fontello_name);
}

@font-face {
  font-family: $fontello_name;
  src: url('data:application/octet-stream;base64,<%= eot_base64 %>') format('embedded-opentype'),
  url('data:application/octet-stream;base64,<%= woff_base64 %>') format('woff'),
  url('data:application/octet-stream;base64,<%= truetype_base64 %>') format('truetype');
}
