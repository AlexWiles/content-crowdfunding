module R
  module Lib
    def urls
      Rails.application.routes.url_helpers
    end

    def display_date(publishable)
      if publishable.published?
        publishable.published_at.strftime("%B %d, %Y")
      else
        publishable.updated_at.strftime("%B %d, %Y")
      end
    end
  end
end