require 'base64'
require 'tempfile'

module Hawk
  class Response
    def initialize(uuid,data)
      @uuid = uuid
      @data = data
    end

    def final?
      !@data['final_sparql_base64'].nil?
    end

    def answers
      @answers ||= @data['answer'].map {|answer_data| Hawk::Answer.new(answer_data)}
    end

    def to_speech
      return unless @answers.any?

      tempfile = Tempfile.new(["answer_#{@uuid}",".wav"], encoding: 'ascii-8bit')
      answer_text = "I think the answer is #{answers.map(&:label).join(" and ")}."
      system("echo \"#{answer_text}\" | text2wave > #{tempfile.path}")
      return Base64::encode64(tempfile.read)
    ensure
      if tempfile
        tempfile.close
        tempfile.unlink
      end
    end

    def as_json
      {
          uuid: @uuid,
          query: @data['input_question'],
          answers: answers.map(&:as_json),
          audio_answer: self.to_speech
      }
    end
  end
end
