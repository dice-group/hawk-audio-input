module Hawk
  def self.config
    @config ||= Configuration.new
  end

  def self.configure
    yield(config)
  end


  class Configuration
    attr_accessor :url

    def initialize
      @url = '139.18.2.164:8181'
    end
  end
end

require './lib/hawk/connector'
require './lib/hawk/response'
require './lib/hawk/answer'
