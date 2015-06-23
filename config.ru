require 'sinatra'
require 'sinatra/reloader' if development?
require "sinatra/json"

require 'haml'
require 'tilt/haml'
require 'bootstrap-sass'

require 'sass/plugin/rack'

require './app'

Sass::Plugin.options[:style] = :compressed
use Sass::Plugin::Rack

run Prototype::App
