module DraftjsExporter
  class HTML
    def add_node(element, text, state)
      document = element.document
      node = begin
        if state.text? && text.length > 0
          document.create_text_node(text)
        elsif state.text?
          document.create_element('br')
        else
          document.create_element('span', text, state.element_attributes)
        end
      end

      element.add_child(node)
    end
  end
end

class DraftJsService
  class Link
    attr_reader :configuration

    def initialize(configuration = { className: nil })
      @configuration = configuration
    end

    def call(parent_element, data)
      args = { href: data.fetch(:data, {}).fetch(:href), style: "text-decoration: underline;" }
      args[:class] = configuration.fetch(:className) if configuration[:className]

      element = parent_element.document.create_element('a', args)
      parent_element.add_child(element)
      element
    end
  end

  class Image
    attr_reader :configuration

    def initialize(configuration = { className: nil })
      @configuration = configuration
      cf_url = ENV['CLOUDFRONT_ENDPOINT']
      cf_url = "https://" + cf_url if cf_url
      @base_url = cf_url || Rails.application.routes.url_helpers.root_url[0...-1]
    end

    def call(parent_element, data)
      img_data = data.fetch(:data, {})
      img_width = img_data[:width].presence || "100%"
      img_shadow = img_data[:shadow].presence || false

      img_args = {
        src:  @base_url + data.fetch(:data, {}).fetch(:src),
        class: (img_shadow ? "shadow" : ""),
        style: "width: #{img_width}; align-self: flex-start; max-width: 100%;"
      }

      image = parent_element.document.create_element('img', img_args)

      div_args = { class: "d-flex justify-content-center" }
      div = parent_element.document.create_element('div', div_args)
      div.add_child(image)
      parent_element.add_child(div)
      div
    end
  end

  class Blockquote
    attr_reader :configuration

    def initialize(configuration = { className: nil })
      @configuration = configuration
    end

    def call(parent_element, data)
      args = { src: data.fetch(:data, {}).fetch(:src) }
      args[:class] = "w-100"

      element = parent_element.document.create_element('div', args)
      parent_element.add_child(element)
      element
    end
  end

  def self.browser(body)
    config = {
      entity_decorators: {
        'LINK' => Link.new,
        'IMAGE' => Image.new
      },
      block_map: {
        'header-three' => { element: 'h3' },
        'unordered-list-item' => {
          element: 'li',
          wrapper: ['ul', {style: "font-family: Georgia, serif; font-size: 18px; line-height: 28px; font-weight: 400;"}]
        },
        'ordered-list-item' => {
          element: 'li',
          wrapper: ['ol', {style: "font-family: Georgia, serif; font-size: 18px; line-height: 28px; font-weight: 400;"}]
        },
        'atomic' => { element: 'div' },
        'unstyled' => { element: 'div', wrapper: ['div', {style: "font-family: Georgia, serif; font-size: 18px; line-height: 28px; font-weight: 400;"}] },
        'blockquote' => {
          element: 'div',
          wrapper: [
            'div',
            { style: 'font-size: 15px; line-height: 25px; font-weight: 400; border-left-width: 2px; border-left-style: solid; border-left-color: #ccc; padding-left: 10px;' }
          ]
        },
        "code-block" => {
          element: 'pre',
          wrapper: [
            'div',
            { style: 'line-height: 1.2rem; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 14px; padding: 5px; background-color: rgb(238, 238, 238); overflow-x: scroll; white-space: nowrap;'}
          ]
        }
      },
      style_map: {
        'ITALIC' => { fontStyle: 'italic' },
        'BOLD' => { fontWeight: 'bold' },
        'UNDERLINE' => { }
      }
    }
    body.deep_symbolize_keys!
    DraftjsExporter::HTML.new(config).call(body)
  end




  class EmailImage
    attr_reader :configuration

    def initialize(configuration = { className: nil })
      @configuration = configuration
      cf_url = ENV['CLOUDFRONT_ENDPOINT']
      cf_url = "https://" + cf_url if cf_url
      @base_url = cf_url || Rails.application.routes.url_helpers.root_url[0...-1]
    end

    def call(parent_element, data)
      args = {
        src: @base_url + data.fetch(:data, {}).fetch(:src),
        style: "max-width: 600px; width: 100%;",
        width: "600"
       }
      args[:class] = ""

      element = parent_element.document.create_element('img', args)
      parent_element.add_child(element)
      element
    end
  end

  class EmailLink
    attr_reader :configuration

    def initialize(configuration = { className: nil })
      @configuration = configuration
    end

    def call(parent_element, data)
      args = { href: data.fetch(:data, {}).fetch(:href), style: "text-decoration: underline; color: #333333;" }
      args[:class] = configuration.fetch(:className) if configuration[:className]

      element = parent_element.document.create_element('a', args)
      parent_element.add_child(element)
      element
    end
  end

  def self.email(body)
    config = {
      entity_decorators: {
        'LINK' => EmailLink.new,
        'IMAGE' => EmailImage.new
      },
      block_map: {
        'header-three' => { element: 'span', wrapper: ['h3', {style: "margin: 0px 0px 10px 0px; font-size: 20px;"}]},
        'unordered-list-item' => {
          element: 'li',
          wrapper: ['ul', {style: "font-size: 16px; line-height: 24px; font-family: Georgia, serif;" }]
        },
        'ordered-list-item' => {
          element: 'li',
          wrapper: ['ol', {style: "font-size: 16px; line-height: 24px; font-family: Georgia, serif;" }]
        },
        'atomic' => {element: 'div'},
        'unstyled' => { element: 'div',
          wrapper: [
            'div',
            {style: "font-size: 16px; line-height: 24px; font-family: Georgia, serif;" }
          ]
         },
        'blockquote' => {
          element: 'div',
          wrapper: [
            'div',
            { style: 'font-size: 15px; line-height: 25px; font-weight: 400; border-left-width: 2px; border-left-style: solid; border-left-color: #ccc; padding-left: 10px;' }
          ]
        },
        "code-block" => {
          element: 'pre',
          wrapper: [
            'div',
            { style: 'margin: 0px; line-height: 19px; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 14px; padding: 5px; background-color: rgb(238, 238, 238); overflow-x: scroll; white-space: nowrap;'}
          ]
        }
      },
      style_map: {
        'ITALIC' => { fontStyle: 'italic' },
        'BOLD' => { fontWeight: 'bold' },
        'UNDERLINE' => { }
      }
    }
    body.deep_symbolize_keys!
    DraftjsExporter::HTML.new(config).call(body)
  end
end

