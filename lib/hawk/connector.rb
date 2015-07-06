require 'httparty'

module Hawk
  class Connector
    include HTTParty

    base_uri Hawk.config.url
    format :json

    def self.get(path,options={})
      response = super(path,options)
      raise Hawk::Connector::Error.new(response.code) unless response.success?
      response
    end

    def self.search(question)
      get('/search',{query: {q: question}}).body.gsub("\"","")
    end

    def self.status(uuid)
      data = JSON.parse(get('/status',{query: {'UUID' => uuid}}).body)
      Hawk::Response.new(uuid,data)
    end

    class Error < StandardError
      def initialize(status)
        super("Request returned with status '#{status}'")
      end
    end
  end
end
