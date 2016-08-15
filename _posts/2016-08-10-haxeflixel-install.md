---
layout: post
title: Instalación de Haxe, OpenFL y Haxeflixel
tags:
  - Tutoriales Haxeflixel
---

En el siguiente tutorial voy a detallar los pasos para instalar Haxe y las bibliotecas necesarias para desarrollar videojuegos con Haxeflixel.

Éste forma parte de una serie de artículos sobre desarrollo de videojuegos en Haxeflixel. Aquí hay un índice de los artículos publicados hasta el momento:

<ul>
{% for post in site.posts reversed %}
  {% for tag in post.tags %}
    {% if tag == "Tutoriales Haxeflixel" %}
      {% if page.title != post.title %}
        <li><a href="{{site.baseurl}}{{post.url}}">{{ post.title }}</a></li>
      {% else %}
        <li>{{ post.title }} (éste artículo)</li>
      {% endif %}
    {% endif %}
  {% endfor %}
{% endfor %}
</ul>


## Haxe toolkit

El primer paso es descargar e instalar las herramientas de Haxe. Se pueden encontrar instaladores para distintas plataformas en [http://haxe.org/download](). En las capturas de pantalla que se muestran debajo se pueden ver algunas capturas de pantalla del proceso de instalación en Windows. Además del compilador de Haxe, también se instalará Neko, una máquina virtual que Haxe necesita para algunas de sus herramientas.

<div id="img_gallery_haxesetup">
  {% for i in (1...4) %}
    <img src="{{site.baseurl}}/images/haxe_setup_{{ i }}.png"/>
  {% endfor %}
</div>
<script>
$(document).ready(function(){createPhotoGallery("#img_gallery_haxesetup", 3500);})
</script>

En el caso de sistemas operativos basados en GNU/Linux, tanto Haxe como Neko suelen estar disponibles en los gestores de paquetes de la mayoría de las distribuciones.

Para instrucciones detalladas sobre el proceso de instalación se puede consultar la página: [http://haxe.org/doc/install/](http://haxe.org/doc/install/).

Una vez finalizada la instalación, podemos comprobar que Haxe funciona correctamente abriendo una consola de comando (en Windows hacer click en *"Inicio"*->*"Ejecutar"* luego escibir el comando *"cmd"* y presionar la tecla ENTER) y lanzar el comando *"haxe"*. El compilador de Haxe debería responder mostrándonos las opciones disponibles con una salida similar a la que se muestra a continuación.

<div  class="console">
<pre>
<code>C:\Users\pabab&gt; haxe
Haxe Compiler 3.2.1 - (C)2005-2015 Haxe Foundation
 Usage : haxe -main &lt;class&gt; [-swf|-js|-neko|-php|-cpp|-as3] &lt;output&gt; [options]
 Options :
  -cp &lt;path&gt; : add a directory to find source files
  -js &lt;file&gt; : compile code to JavaScript file
  -swf &lt;file&gt; : compile code to Flash SWF file
  -as3 &lt;directory&gt; : generate AS3 code into target directory
  -neko &lt;file&gt; : compile code to Neko Binary
  -php &lt;directory&gt; : generate PHP code into target directory
  -cpp &lt;directory&gt; : generate C++ code into target directory
  -cs &lt;directory&gt; : generate C# code into target directory
  -java &lt;directory&gt; : generate Java code into target directory
  -python &lt;file&gt; : generate Python code as target file
  -xml &lt;file&gt; : generate XML types description
  -main &lt;class&gt; : select startup class
  -lib &lt;library[:version]&gt; : use a haxelib library
  -D &lt;var&gt; : define a conditional compilation flag
  -v : turn on verbose mode
  -debug : add debug information to the compiled code
  -help : show extended help information
  --help : show extended help information
  --help-defines : print help for all compiler specific defines
  --help-metas : print help for all compiler metadatas
  &lt;dot-path&gt; : compile the module specified by dot-path
C:\Users\pabab&gt; </code>
</pre>
</div>

## HaxeFlixel, OpenFL, y otras bibliotecas

Entre las herramientas del Toolkit Haxe se encuentra *"haxelib"*, un gestor de paquetes que podemos utilizar para descargar e instalar bibliotecas. El comando debe ser invocado desde la consola. Antes de empezar es necesario correr el comando *"haxelib setup"*, que sirve para especificar el directorio en donde se instalarán las bibliotecas descargadas.

<div  class="console">
<pre>
<code>C:\Users\pabab&gt; haxelib setup
Please enter haxelib repositoy path with write access
Hit enter for default (C:\motion-twin\haxe\lib)
Path: </code>
</pre>
</div>

Generalmente es conveniente dejar el directorio por defecto. Hay que tener en cuenta que el directorio elegido necesitará contar con permisos de escritura.

Para instalar una biblioteca con haxelib se debe escribir en la consola el comando *"haxelib install &lt;biblioteca&gt;"*. Para instalar Haxeflixel será necesario escribir los siguientes comandos que instalarán la biblioteca y sus agregados.

<div  class="console">
<pre>
<code>haxelib install flixel
haxelib install flixel-addons
haxelib install flixel-templates
haxelib install flixel-tools
haxelib install flixel-ui</code>
</pre>
</div>

Al instalar la biblioteca *flixel* también se instalarán sus dependencias: *OpenFL* y *Lime*.

## Eligiendo un IDE

A la hora de elegir un entorno de desarrollo (o *IDE* por Integrated Development Environment) creo que [FlashDevelop](http://www.flashdevelop.org/) es la mejor opción si se utiliza un sistema operativo Windows. Es un entorno libre y liviano con una interfaz de sencilla y un autocompletado de código que funciona bastante bien.

Lamentablemente FlashDevelop no está disponible para GNU/Linux. Algunas buenas opciones para este sistema operativo son [Sublime Text](https://www.sublimetext.com/) (es shareware) o [atom.io](https://atom.io/). Ambos son editores de uso general que cuentan con plugins para Haxe y Lime.

Para conocer más opciones respecto a otros IDE que pueden utilzarse con Haxe pueden consultar [ésta página](http://haxe.org/documentation/introduction/editors-and-ides.html).


## Probando que todo funcione

Finalmente resta probar que las herramientas funcionen correctamente compilando un ejemplo real. Es posible puede crear un proyecto con el código de uno de los [demos](http://haxeflixel.com/demos) utilizando el comando:

<div  class="console">
<pre>
<code>haxelib run flixel-tools create</code>
</pre>
</div>

o bien crear un proyecto vacío con el comando:

<div  class="console">
<pre>
<code>haxelib run flixel-tools template -n "nuevoProyecto"</code>
</pre>
</div>

Pueden intentar compilar y ejecutar el proyecto con el IDE elegido. En éste punto también deberán elegir para cuál plataforma desean crear el ejecutable. Generalmente neko y flash son las dos plataformas más rápidas para compilar y que no requieren ninguna configuración adicional.

Para compilar y ejecutar el proyecto desde la línea de comando, pueden abrir una consola en el directorio del proyecto y escribir el siguiente comando para compilar y ejecutar el juego para la plataforma *Neko*:

<div  class="console">
<pre>
<code>haxelib run lime test neko</code>
</pre>
</div>

Para hacer lo mismo para la plataforma *Flash*, el comando sería:

<div  class="console">
<pre>
<code>haxelib run lime test flash</code>
</pre>
</div>

Los ejecutables aparecerán en una carpeta llamada *"export"* que se creará dentro del directorio del proyecto.
