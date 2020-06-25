# typed: false
class BetaUsersController < ApplicationController
  # POST /beta_users
  # POST /beta_users.json
  def create
    @beta_user = BetaUser.find_or_initialize_by(beta_user_params)

    respond_to do |format|
      if @beta_user.save
        format.html { redirect_to root_path, notice: 'Successfully added to beta list' }
        format.json { render :show, status: :created }
      else
        format.html { render :new }
        format.json { render json: @beta_user.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_beta_user
      @beta_user = BetaUser.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def beta_user_params
      params.require(:beta_user).permit(:email)
    end
end
