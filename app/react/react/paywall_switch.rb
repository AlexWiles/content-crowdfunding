module React
  class PaywallSwitch
    extend R::Lib

    def self.name
      "PaywallSwitch"
    end

    def self.props(project, token)
      {
        token: token,
        project: R::Project.s(project),
      }
    end
  end
end