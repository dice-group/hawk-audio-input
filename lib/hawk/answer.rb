require 'sparql/client'

module Hawk
  class Answer

    attr_reader :uri, :abstract, :image

    def initialize(data)
      @uri = data['URI']
      @abstract = data['abstract']
      @image = data['thumbnail']


      @sparql_client = SPARQL::Client.new('http://dbpedia.org/sparql')
    end

    def label
      @label ||= get_label
    end

    def as_json
      {
        uri: uri,
        label: label,
        abstract: abstract,
        image: image
      }
    end

    private
    def get_label
      query = "
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?name WHERE {
          <#{uri}> rdfs:label ?name.
          FILTER(langMatches(lang(?name), 'EN'))
      }"

      result = @sparql_client.query(query)

      return nil unless result.any?

      result.first[:name].value
    end
  end
end
