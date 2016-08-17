---
layout: post
title: Nuestro primer proyecto en Haxeflixel
tags:
  - Tutoriales Haxeflixel
---

En el siguiente artículo voy a mostrarles un proyecto mínimo de Haxeflixel y explicar el funcionamiento general del motor.

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

Para crear un proyecto en blanco de HaxeFlixel se puede utilizar el siguiente comando de consola, como les comenté anteriormente:

haxelib run flixel-tools template -n "NuevoProyectos"

También pueden utilizar su ide favorito para crear el proyecto si el mismo trae un template.

Ya sea que usen una manera o la otra, generalmente la plantilla trae algunos archivos, que quizás no utilicemos enseguida. Es por eso que aquí analizaremos un proyecto minimo con la menor cantidad de archivos necesarios para simplificar.

Un proyecto en haxeflixel tiene la siguiente estructura de directorios.

* El subdirectorio *"assets"* contiene subdirectorios para almacenar imágenes, sonido, música y otros archivos de recursos que se utilizarán en el juego
* El subdirectorio *"export"* contiene los ejecutables del juego generados para las distintas plataformas
* El archivo *"Project.xml"* es un descriptor del proyecto en el que pueden ajustarse distintas opciones del proyecto
* El archivo con extensión, .hxproj ????SOLO ESTA SI CREAMOS EL PROEYCTO CON FLASHDEVELOP/HaxeDevelop, que no aparece en la imagen, corresponde al archivo de proyecto de FlashDevelop
* Finalmente, el subdirectorio *"source"* va a contener los fuentes de nuestro juego


## Sobre cómo funciona el motor

ES MUY IMPORTANTE Entender antes de empezar que haxeflixel es un motor basado en herencia. Es decir, contruiremos nuestros juegos creando clases que hereden de otras clases ya creadas y redefiniendo sus métodos.

Todos juego está compuesto por escenas o estados. En Haxeflixel las escenas se representan con la clase FlxState. Para crear una escena en nuestro juego debemos heredar de dicha clase y redefinir los métodos que consideremos necesarios.

Algunos de los métodos de la clase FlxState que interesa redefinir son los siguientes:

* create()
* update()
* draw()
* destroy()

Estos métodos son llamados automáticamente por el motor al momento de crear la escena en el caso de create(), en cada frame para actualizarla y dibujarla (update y draw) y cuando la misma debe ser destruida.
Muy pocas veces redefiniremos los métodos draw() y destroy(), ya que su comportamiento predefinido nos sirve. Por otro lado generalmente redefiniremos create() y update() para ampliar el comportamiento de dichos métodos. En el caso del primero nos permitirá inicializar y agregar tambien los actores de nuestra escena, en el caso del segundo nos permitirá agregar nuestra propia lógica al comportamiento de la escena.


## Un ejemplo concreto

Proyecto que analizaremos ahora solo tiene 2 archivos fuente: 1 escena y un main que qpunta a dicha escena.
El archivo que se ve debajo es PlayState.hx y contiene el código de una escena.

<div class="code">
    <pre name="code" class="brush: haxe; toolbar: false; gutter: true;">
import flixel.FlxState;
import flixel.FlxSprite;

class PlayState extends FlxState
{
	private var sprite1: FlxSprite;

	override public function create()
	{
		super.create();
		sprite1 = new FlxSprite(100, 100, "assets/images/ImpGuy_0.jpg");
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

. En Haxe la palabra reservada class se utiliza para definir una clase, mientras que extends indica herencia. , se utiliza la palabra reservada extends para indicar herencia. Como se ve en el código la clase PlayState hereda de FlxState.

En el ejemplo se han redefinido dos funciones : create y update().

La sintaxis de haxe para declarar un método es usar la palabra function. los indicadores public o private indican la accecibilidad de la funcion desde afuera de la clase. En éste caso, ya que la función se está redefiniendo una de la clase padre, se debe anteponer la palabra reservada override.

La parte más interesante del ejemplo corresponde al método create() que, como mencioné anteriormente, será llamado para inicializar la escena. El método crea un sprite y lo agrega a la escena. Como es de esperar, cuando redefinimos un método no nos interesa reemplazar completamente su comportamiento sino agregarle nuestra propia lógica. Es por ello que, para que la escena se inicialice correctamente, será necesario invocar al método create() de la clase padre (explicar mejor esto). Ya que se ha redefinido al método create() tenemos que hacer referencia al método de la clase padre utilizando la palabra reservada super.

En Haxeflixel, los sprites se representan con la clase FLxSprite. La escena crea un sprite en la posición 100,100 y con la imagen "....". La creación de un objeto se realiza con el operador new, y no debemos preocuparnos por su destrucción ya que Haxe se encargará automáticamente de eso. Finalmente el sprite se agrega a la escena con el método add() (heredado de la clase FlxState).

En el siguiente tutorial explicaremos mejor como se redefine update.

Debajo pueden observar el ejemplo en funcionamiento. Pueden obtener el código fuente aquí.
