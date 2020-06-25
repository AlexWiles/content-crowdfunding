class DateService

  SECS_PER_HOUR = 60 * 60
  SECS_PER_DAY = 60 * 60 * 24


  def self.pluralize(a, b)
    ActionView::Helpers::TextHelper.pluralize(a, b)
  end

  def self.rem(date)
    total_secs = date - Time.now
    days = (total_secs / SECS_PER_DAY).floor
    hour_secs = total_secs - (days * SECS_PER_DAY)
    hours = (hour_secs / SECS_PER_HOUR).floor
    min_secs = hour_secs - (hours * SECS_PER_HOUR)
    mins = (min_secs / 60).floor

    {days: days, hours: hours, mins: mins}
  end

  def self.rem_str(date)
    parts = rem(date)
    days = parts[:days]
    hours = parts[:hours]
    mins = parts[:mins]


    if days > 0
      "#{days} #{'day'.pluralize(days)} to go"
    elsif days == 0 && hours > 0
      "#{hours} #{'hour'.pluralize(days)} #{mins} #{'minute'.pluralize(mins)} remaining"
    elsif days == 0 && hours == 0 && mins > 0
      "#{mins} #{'minute'.pluralize(mins)} remaining"
    end
  end
end