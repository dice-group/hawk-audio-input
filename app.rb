module HawkAudioInput
  class App < Sinatra::Base

    set :server, 'thin'
    set :sockets, {}

    get '/' do
      haml :index
    end

    get '/speech_to_text' do
      if !request.websocket?
        haml :index
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
            settings.sockets[ws] = nil
            settings.sockets.delete(ws)
          end
        end
      end
    end

    get '/search' do
      @query = params['q']
      @uuid = Hawk::Connector.search(@query)
      haml :search
    end

    get '/status/:uuid' do
      @resp = Hawk::Connector.status(params[:uuid])

      content_type :json
      if @resp.final?
        @resp.as_json.to_json
      else
        nil.to_json
      end
    end


  end
end
