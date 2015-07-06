require 'ruby-libsamplerate'
require 'pocketsphinx-ruby'
require 'tempfile'

class SpeechToTextProcessor
  attr_reader :hyp

  def initialize
      @resampler = SRC::Simple.new(44100, 16000, 1)
      @configuration = Pocketsphinx::Configuration.default
      @decoder = Pocketsphinx::Decoder.new(@configuration)
      @file = Tempfile.new(["micinput",".raw"],:encoding => 'ascii-8bit')
  end

  def write(data)
    @file.write downsample(data)
    @file.flush
  end

  def analyze
    @decoder.decode(@file.path)
    @decoder.hypothesis
  end

  def reset
    @file = Tempfile.new(["micinput",".raw"],:encoding => 'ascii-8bit')
  end

  def close
    @file.close
    @file.unlink  
    @decoder = nil
  end

  private
  def downsample(data)
    data = data.unpack("s*")
    data = SRC::Convert.short_to_float(data)
    data = @resampler.resample data
    data = SRC::Convert.float_to_short(data)
    data = data.pack("s*")
    data
  end
end
