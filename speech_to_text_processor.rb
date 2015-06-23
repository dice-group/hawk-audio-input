require 'pocketsphinx-ruby'

class SpeechToTextProcessor
  def initialize(file)
      @file = normalize_audio_file(file)
      config = Pocketsphinx::Configuration.default
      config['lw'] = 7.0
      config['topn'] = 16
      config['fillprob'] = 1.0e-06
      config['silprob'] = 0.1
      config['wip'] = 0.5
      config['compallsen'] = true
      config['beam'] = 1.0e-80
      config['maxhmmpf'] = 30000
      config['logfn'] = File.join([Dir.pwd,'log','pocket_sphinx.log'])

      @decoder = Pocketsphinx::Decoder.new(config)
  end

  def get_hypothesis
    @decoder.decode(@file.path)
    @decoder.hypothesis
  end

  private

  def normalize_audio_file(file)
    input = Tempfile.new(['input','.wav'])
    input.write(file.read)

    output = Tempfile.new(['output','.wav'])
    system("sox #{input.path} -r 16k #{output.path} channels 1")
    output
  end
end
