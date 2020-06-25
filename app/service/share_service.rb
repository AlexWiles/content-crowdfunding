class ShareService
  def self.urls
    Rails.application.routes.url_helpers
  end

  def self.post_twitter_url(post)
    url = urls.project_post_url(post.project, post, subdomain: post.project.user.slug)
    text = "#{post.title} by #{post.project.user.display_name || post.project.user.slug }"
    params = { url: url, text: text }.to_param
    "https://twitter.com/intent/tweet?" + params
  end

  def self.post_facebook_url(post)
    url = urls.project_post_url(post.project, post, subdomain: post.project.user.slug)
    text = "#{post.title} by #{post.project.user.display_name || post.project.user.slug }"

    params = { u: url, p: { title: text } }.to_param

    "http://www.facebook.com/sharer.php?" + params
  end

  def self.project_twitter_url(project)
    url = urls.project_url(project, subdomain: project.user.slug)
    text = "#{project.title} by #{project.user.display_name || project.user.slug }"
    params = { url: url, text: text }.to_param
    "https://twitter.com/intent/tweet?" + params
  end

  def self.project_facebook_url(project)
    url = urls.project_url(project, subdomain: project.user.slug)
    text = "#{project.title} by #{project.user.display_name || project.user.slug }"

    params = { u: url, p: { title: text } }.to_param

    "http://www.facebook.com/sharer.php?" + params
  end
end