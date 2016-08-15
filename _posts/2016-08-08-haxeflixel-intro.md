---
layout: post
title: Una introducción a Haxeflixel
tags:
  - Tutoriales Haxeflixel
---

[Haxeflixel](http://haxeflixel.com/) es una potente biblioteca para desarrollar videojuegos en 2D de manera sencilla. Entre las principales características de HaxeFlixel, pueden destacarse las siguientes:

* Manejo de escenas y jerarquías de actores/entidades
* Spritesheets y animaciones
* Física y colisiones básicas entre objetos
* Sistemas de partículas
* Soporte para tilemaps
* Incorpora un poderoso depurador visual interactivo
* Es libre y gratuito tanto para uso personal como comercial
* Permite exportar a múltiples plataformas de escritorio, móviles y web de manera nativa (sin necesidad de plugins ni runtimes)


Éste es el primero de una serie de tutoriales en los que aboradaré el uso de las distintas partes del motor Haxeflixel. Aquí hay un índice de los artículos publicados hasta el momento:

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

![haxeflixel_long_logo]({{site.baseurl}}/images/haxeflixel_long_logo.png)

Haxeflixel se basa en otras bibliotecas y herramientas que hacen posible su funcionamiento, a continuación presentaremos brevemente a las más importantes.

## Haxe
[Haxe](http://haxe.org) es un potente y moderno lenguaje de programación multiplataforma, acompañado por un compilador y otras herramientas. Haxe lleva ya varios años de desarrollo y posee una comunidad muy activa. Su sintaxis es bastante parecida a la de otros lenguajes conocidos como ActionScript o Java. Pero sin duda la particularidad más interesante de Haxe es que su compilador es capaz traducir código fuente a otros lenguajes de programación como C++, Java, Javascript, PHP y C#.

## Flixel
Haxeflixel toma gran parte de su base de código de [Flixel](http://www.flixel.org), una biblioteca de videojuegos para Adobe® Flash escrita por Adam Saltsman.

## OpenFL
[OpenFL](http://www.openfl.org) es una reimplementación abierta de la API de Adobe® Flash. Sin embargo, a diferencia de ésta, OpenFL está programada sobre Haxe, lo cual permite que las aplicaciones desarrolladas con la misma sean capaces de correr en una amplia variedad de plataformas aprovechando las capacidades de hardware particulares de cada una.

## Lime
[Lime](https://github.com/openfl/lime) es un middleware de bajo nivel para Haxe. Es la capa que permite a los programas escritos en Haxe comunicarse, de manera unificada, con el hardware de distintos dispositivos. Lime ofrece una API única para manejar ventanas, eventos de entrada, audio, contextos de renderizado y otros recursos.

En conjunto con las capacidades del compilador Haxe para traducir código fuente, es Lime quien hace posible que los juegos desarrollados en Haxeflixel puedan ser fácilmente exportados a plataformas como Android, iOS, Windows, Linux o HTML5.

### Algunos enlaces de interés

* [Haxeflixel](http://haxeflixel.com/)
* [Demos](http://haxeflixel.com/demos)
* [Documentación de Haxeflixel](http://api.haxeflixel.com/)
* [Github](https://github.com/HaxeFlixel/flixel)
* [Referencia del lenguaje Haxe](http://api.haxe.org/)
