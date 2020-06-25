# frozen_string_literal: true

# Take a signed permanent reference for a blob representation and turn it into an expiring service URL for download.
# Note: These URLs are publicly accessible. If you need to enforce access protection beyond the
# security-through-obscurity factor of the signed blob and variation reference, you'll need to implement your own
# authenticated redirection controller.

# TODO remove this when updgrading to Rails 6.1
class ActiveStorage::RepresentationsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob

  def show
    http_cache_forever public: true do
      set_content_headers_from representation.image
      stream representation
    end
  end

  private

  def representation
    @representation ||= @blob.representation(params[:variation_key]).processed
  end

  def set_content_headers_from(blob)
    response.headers["Content-Type"] = blob.content_type
    response.headers["Content-Disposition"] = ActionDispatch::Http::ContentDisposition.format \
      disposition: params[:disposition] || "inline", filename: blob.filename.sanitized
  end

  def stream(variant)
    variant.service.download(variant.key) do |chunk|
      response.stream.write chunk
    end
  ensure
    response.stream.close
  end
end