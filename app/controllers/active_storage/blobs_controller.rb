# https://github.com/rails/rails/blob/v6.0.2.2/activestorage/app/controllers/active_storage/blobs_controller.rb
# https://github.com/rails/rails/pull/34477/files
class ActiveStorage::BlobsController < ActiveStorage::BaseController
  include ActiveStorage::SetBlob

  def show
    http_cache_forever public: true do
      set_content_headers_from @blob
      stream @blob
    end
  end

  private

  def stream(blob)
    blob.download do |chunk|
      response.stream.write chunk
    end
  ensure
    response.stream.close
  end

  def set_content_headers_from(blob)
    response.headers["Content-Type"] = blob.content_type
    response.headers["Content-Disposition"] = ActionDispatch::Http::ContentDisposition.format \
      disposition: params[:disposition] || "inline", filename: blob.filename.sanitized
  end
end