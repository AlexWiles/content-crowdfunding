module React
  class FollowButton
    extend R::Lib

    def self.name
      "FollowButton"
    end

    def self.props(user, project)
      follow = project.follows.not_deleted.find_by(user: user)
      {
        follows: follow.present?,
        followUrl: urls.user_project_follow_path(user, project),
        unfollowUrl: urls.user_project_unfollow_path(user, project),
      }
    end
  end
end