class AddUserIdToPledge < ActiveRecord::Migration[6.0]
  def change
    add_reference :pledges, :user, null: false, foreign_key: true
  end
end
