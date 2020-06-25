class AttachmentService
  def self.urls
    Rails.application.routes.url_helpers
  end

  def self.cdn_url(attachment)

    # generate url for pointing to the uncomma.com cdn.
    # uncomma CDN will cache redirects to the file upload CDN
    # which will have a cached image
    if Rails.env.production? && ENV['CLOUDFRONT_ENDPOINT']
      parsed = URI.parse(urls.url_for(attachment))
      cloudfront_host = ENV['CLOUDFRONT_ENDPOINT']
      resp_url = URI::HTTPS.build(host: cloudfront_host, path: parsed.path, query: parsed.query).to_s
      resp_url
    else
      urls.url_for(attachment)
    end
  end
end