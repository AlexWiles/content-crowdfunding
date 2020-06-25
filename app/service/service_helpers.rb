# typed: false
require 'logger'

module ServiceHelpers
  def handle_exception(&block)
    begin
      block.call
      return true
    rescue => e
      Rails.logger.error e.message
      e.backtrace.each { |line| Rails.logger.error line }
      return false
    end
  end

  def transaction(&block)
    ActiveRecord::Base.transaction(requires_new: true) do
      block.call
    end
  end
end