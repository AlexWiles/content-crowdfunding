module React
  class BuyForm
    extend R::Lib

    def self.name
      "BuyForm"
    end

    def self.props(user, project)
      React::BackerForm.props(user, project)
    end
  end
end