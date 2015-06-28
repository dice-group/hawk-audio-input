require './speech_to_text_processor'
module Prototype
  class App < Sinatra::Base

    set :server, 'thin'
    set :sockets, {}

    get '/' do
      @content = "Hey there"
      haml :index
    end

    #post '/speech_to_text' do
    #  processor = SpeechToTextProcessor.new(params["data"][:tempfile])
    #  json hypothesis: processor.get_hypothesis
    #end

    get '/speech_to_text' do
      if !request.websocket?
        erb :index
      else
        request.websocket do |ws|
          ws.onopen do
            settings.sockets[ws] = SpeechToTextProcessor.new
          end
          ws.onmessage do |msg|
            if 'get_hypothesis' == msg
              hypothesis = settings.sockets[ws].analyze
              ws.send(hypothesis) if hypothesis
              settings.sockets[ws].reset
            else
              settings.sockets[ws].write(msg)
            end
          end
          ws.onclose do
            settings.sockets[ws].close
            settings.sockets.delete(ws)
          end
        end
      end
    end
  end
end
