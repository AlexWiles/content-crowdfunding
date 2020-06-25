class FollowService
  extend ServiceHelpers

  def self.create!(user, project)
    transaction do
      follow = Follow.where(user: user, project: project).first_or_create!
      follow.can_notify!
      follow
    end
  end

  def self.create(user, project)
    handle_exception { create!(user, project) }
  end

  def self.silence!(user, project)
    transaction do
      follow = Follow.where(user: user, project: project).first_or_create!
      follow.silence!
      follow
    end
  end

  def self.destroy!(user, project)
    Follow.find_by(user: user, project: project)&.mark_deleted!
  end

  def self.follow_creator_blog!(user)
    project = Project.find_by(special_id: :creators)

    if project.present?
      follow = Follow.find_by(user: user, project: project)
      create!(user, project) unless follow.present?
      follow
    end
  end
end