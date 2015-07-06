require 'thin'

require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra-websocket'

require 'haml'
require 'tilt/haml'
require 'json'

require 'sass/plugin/rack'

require './lib/hawk.rb'
require './lib/speech_to_text_processor'
require './app'

Sass::Plugin.options[:style] = :compressed
use Sass::Plugin::Rack

run HawkAudioInput::App
