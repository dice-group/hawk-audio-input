require './speech_to_text_processor'
module Prototype
  class App < Sinatra::Base
    get '/' do
      @content = "Hey there"
      haml :index
    end

    post '/speech_to_text' do
      processor = SpeechToTextProcessor.new(params["data"][:tempfile])
      json hypothesis: processor.get_hypothesis
    end
  end
end
