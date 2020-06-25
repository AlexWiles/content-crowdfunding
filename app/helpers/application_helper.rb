module ApplicationHelper
  def meta_tag(prop, key, fallback=false)
    if content_for?(key) || fallback
      "<meta property=\"#{prop}\" content=\"#{content_for(key) || fallback}\" />".html_safe
    end

  end

  def react_component(component_name, data={}, class_names="")
    json_data = data.to_json
    class_name = "react-#{component_name} #{class_names}"
    content_tag(:div, nil,class: class_name, data: json_data).html_safe
  end

  def react(component_class, *args)
    json_data = component_class.props(*args).to_json
    class_name = "react-#{component_class.name}"
    content_tag(:div, nil, class: class_name, data: json_data).html_safe
  end
end
