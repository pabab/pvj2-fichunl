---
layout: post
title: Nuestro primer proyecto en Haxeflixel
tags:
  - Tutoriales Haxeflixel
---

En el siguiente artículo voy en términos generales el funcionamiento del motor Haxeflixel y mostrarles la estructura de un proyecto mínimo.

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

## Estructura de un proyecto

Para crear un nuevo proyecto en HaxeFlixel se puede utilizar el siguiente comando de consola:

<div class="console">
  haxelib run flixel-tools template -n "NuevoProyecto"
</div>

También es posible crearlo utilizando su IDE favorito, aunque generalemente conviene hacerlo desde la consola ya que las plantillas de proyecto suelen estar actualizadas.

De cualquier manera que se cree el proyecto, las plantillas generalmente traen algunos archivos que no son necesarios inmediatamente. Es por eso que, para simplificar, por el momento analizaremos un proyecto con los mínimos archivos necesarios.

Un proyecto en haxeflixel tiene la siguiente estructura de directorios.

<img style="display: block; margin: 0 auto;" src="{{site.baseurl}}/images/project_struct.png" />

* El subdirectorio *"assets"* es donde se almacenan los recursos para el juego. Contiene a su vez otros subdirectorios para almacenar imágenes, sonido, música y archivos de datos en general.
* El subdirectorio *"export"* contiene los ejecutables que serán generados para las distintas plataformas.
* El archivo *"Project.xml"* es un descriptor desde el cual pueden ajustarse diversas opciones del proyecto. Éste es el archivo que indica cómo debe construirse el proyecto y qué bibliotecas incluir.
* El archivo con extensión *.hxproj* sólo está presente en el caso de proyectos generados con FlashDevelop/HaxeDevelop. Éste archivo sirve para abrir el proyecto desde dichos entornos, pero no aporta ningún tipo de información al proyecto.
* Finalmente, en el subdirectorio *"source"* se encontrarán los fuentes del juego. En éste caso, para el ejemplo que analizaremos, sólo existen dos archivos fuente: *Main.hx* que es el punto de entrada del programa y *"PlayState.hx"* que representa la única escena del juego.


## Sobre el funcionamiento del motor

Antes de empezar a desarrollar en Haxeflixel **ES MUY IMPORTANTE** comprender la arquitectura del motor. Haxeflixel es un motor de juegos basado en herencia. Es decir, para construir nuestros juegos vamos a crear clases, que hereden de otras clases ya definidas en la biblioteca y redefinir sus métodos.

Todos juego está compuesto por escenas o estados. En Haxeflixel dichas escenas se representan con la clase **FlxState**. Para crear una escena en nuestro juego debemos heredar de dicha clase y redefinir los métodos que consideremos necesarios.

Algunos de los métodos de la clase FlxState que interesa nos redefinir son los siguientes:

* *create()*
* *update()*
* *draw()*
* *destroy()*

Estos métodos son llamados automáticamente por el motor. *create()* es invocado al momento de crear la escena. En el caso de *update()* y *draw()*, son llamados en cada frame para actualizar y dibujar la escena. Finalmente, *destroy()* se invoca cuando la misma debe destruirse.

Generalmente no sobreescribiremos los métodos *draw()* ni *destroy()*, ya que su comportamiento predefinido nos sirve. Por otro lado, será común redefinir los métodos *create()* y *update()*. En el caso del primero para inicializar y agregar actores a la escena, mientras que en el caso de *update()* para agregar nuestra propia lógica al comportamiento de la escena.

## Un ejemplo concreto

Como comenté antes, el proyecto que analizaremos sólo tiene dos archivos fuente: el archivo *"Main.hx"* y el archivo *PlayState.hx"*, cuyo código se muestra debajo, que representa la única escena del juego.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
import flixel.FlxState;
import flixel.FlxSprite;

class PlayState extends FlxState
{
  private var sprite1: FlxSprite;

  override public function create()
  {
    super.create();
    sprite1 = new FlxSprite(100, 100, "assets/images/haxeflixel_logo.png");
    add(sprite1);
  }

  override public function update()
  {
    super.update();
  }
}
</pre>
	</div>

<script type="text/javascript">
    SyntaxHighlighter.all()
</script>

 Como se ve en el código, en el lenguaje Haxe las palabras reservadas **class** y **extends** se utilizan para definir una clase e indicar que ésta hereda de otra. La clase **PlayState** hereda de [**FlxState**](http://api.haxeflixel.com/flixel/FlxState.html), que es la clase de utilizada pra representar escenas en Haxeflixel. Como se pueden imaginar, en Haxe, al igual que en otros lenguajes como Java, el nombre del archivo coincide con el nombre de la clase que se define en su interior.

La sintaxis de Haxe para declarar un método es usar la palabra reservada **function** como se puede ver en el ejemplo. Los indicadores **public** o **private** indican la accecibilidad de los métodos y atributos desde afuera de la clase.

En el ejemplo se han redefinido las funciones *create()* y *update()* heredadas de la clase padre. En éste caso se debe anteponer la palabra reservada **override** para indicar dicha situación.

La parte más interesante del ejemplo corresponde al método *create()*, el cual será llamado para inicializar la escena. En el método se crea un sprite y se lo agrega a la escena.

Como es de esperar, cuando se redefine un método, generalente no se desea reemplazar completamente su comportamiento por otro, sino agregar nuestras propias instrucciones al funcionamiento ya existente. Para que la escena se inicialice correctamente, será necesario invocar al método *create()* de la clase padre antes de agregar nuestras propias órdenes. Ésta llamada al método original que se está redefiniendo se realiza utilizando la palabra reservada **super** como se ve en el ejemplo.

En Haxeflixel, los sprites se representan con la clase [**FlxSprite**](http://api.haxeflixel.com/flixel/FlxSprite.html). La escena del ejemplo crea un sprite en la posición *(100, 100)* y con el archivo especificado como textura. La creación de un objeto se realiza con el operador **new**, y no debemos preocuparnos por su destrucción ya que Haxe se encargará automáticamente de ello. Finalmente el sprite se agrega a la escena con el método *add()*, heredado de la clase FlxState, para que sea actualizado y dibujado automáticamente.

Debajo pueden observar el ejemplo en funcionamiento, y pueden descargar el código fuente [aquí](https://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/minimal_project.zip?raw=true).

{% include swf_example.html example_name="minimal_project" modalid="1" %}

## Conclusión

En éste artículo mostramos la estructura de un proyecto en Haxeflixel. Por ser un motor basado en herencia, definimos una escena heredando de la clase **FlxState** y redefiniendo sus métodos.

En el siguiente tutorial explicaremos cómo redefinir el método *update()* para agregar logica a la escena.
