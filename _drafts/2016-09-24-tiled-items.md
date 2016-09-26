---
layout: post
title: Cargar items desde un archivo de nivel
tags:
  - Tutoriales Haxeflixel
  - Tiled
---

En el [artículo anterior]({{site.baseurl/groups-collisions/}}) mostramos cómo crear una escena con un personaje, un mapa, items y enemigos. Sin embargo, especificar la posición de cada elemento en el código no resulta práctico a la hora de diseñar los niveles del juego. En éste tutorial explicaremos algunas técnicas para agregar los elementos del juego directamente desde el editor de mapas.

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

La explicación de éste artículo está centrada en el uso de Haxeflixel en conjunto con el editor Tiled, a pesar de ésto la idea es bastante sencilla y puede aprovecharse también con otros editores.

Si bien Tiled permite crear capas de objetos para los cuales se puede especificar propiedades arbitrarias, una solución mucho más sencilla para posicionar objetos en la escena cuando se utilizan tilemaps consiste en reservar tiles específicos para representar determinados elementos del juego. De esta manera, se puede editar la especificar la ubicación de los objetos desde el editor de tilemaps.

Éste procedimiento resulta sencillo y permite una edición rápida ya que los elementos se posicionan como si se tratase de un tile más. Además, se puede implementar con poco código. Por otro lado, tiene algunas desventajas como el hecho de que cada elemento debe posicionarse en las posiciones de los tiles (no puede haber intermedios) y que no pueden existir 2 elementos en nuna misma posición (aunque ésto puede resolverse parcialmente utilizando varias capas).

En resumen, el procedimiento para hacer ésto sería el siguiente:

1. Recorrer el tilemap y encontrar todos los tiles de un determinado tipo.
2. Para cada uno de esos tiles, calcular su posición dentro del mapa.
3. Crear el objeto correspondiente (enemigo, item, etc) en dicha posición.
4. Borrar el tile (en caso de que hayamos utilizado la misma capa para los items y para el tilemap, ya que colisionaríamos con dichos tiles)






<iframe width="560" style="margin: 0 auto; display: block;" height="315" src="https://www.youtube.com/embed/B6_GJoWySEw" frameborder="0" allowfullscreen></iframe>

## Englobando adentro de una funcion...

Explicar por que hice la funcion...

<script>
  $(document).ready(function(){
    SyntaxHighlighter.all()
  });
</script>

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">

</pre>
</div>
