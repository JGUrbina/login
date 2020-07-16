
function setHtml(url){
    const Html = `
    <!DOCTYPE >
      <html lang="es">
          <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="author" content="Torrefiel" />
              <meta name="keywords" content="" />
              <meta name="description" content="" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
              <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;1,400&display=swap" rel="stylesheet">
               
          </head>
      <body>
        <table width="598" border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#c1c1c8" style="border:1px solid #c1c1c8">
        <tbody>
          
          <tr style="height:90px"></tr>
          <tr style="height:50px">
            <td style="border:none;padding:0" width="100">
              <h1 style="font-family: 'Lato', sans-serif;font-size:20px;text-align:center;font-weight:normal;color:#2a2b3c">¡Hola y bienvenido a Torrefiel!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="border:none;padding:35px 0 30px" align="center">
              <h2 style="font-family: 'Lato', sans-serif;font-size:20px;color:#2a2b3c;max-width:80%;margin:0;font-weight:normal">
                Por favor, <b>confirma tu dirección<br>
                de correo electrónico</b> para poder <br>
                acceder al sistema de Torrefiel.<br>
              </h2>
            </td>
          </tr>
          <tr style="height:90px">
            
            <td align="center">
            
              <a href="${url}">
                <img src="https://i.imgur.com/uP73HGF.png" alt="">
              </a>
            </td>
          </tr>
          
          <tr style="height:70px" align="center">
            <td>
              <span style="font-weight:bold;font-size:13px;font-family:Lato;color:#2a2b3c">Copyright © 2020 Torrefiel, reservados todos los derechos.</span>
            </td>
          </tr>
        </tbody>
        </table>
      </body>
    </html>
  `;
  
    return Html;
  }
  
  module.exports = setHtml;