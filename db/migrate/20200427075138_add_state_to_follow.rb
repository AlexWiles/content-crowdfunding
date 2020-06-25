class AddStateToFollow < ActiveRecord::Migration[6.0]
  def change
    add_column :follows, :aasm_state, :string
  end
end
