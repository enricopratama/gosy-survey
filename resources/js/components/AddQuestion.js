import axios from 'axios';
import React from 'react'

/**
 * Component for 
 * @returns 
 */
export default function AddQuestion() {
    var fd = new FormData();
            fd.append("question_name", question.question_name);
            var url = "/addQuestion";
            var hasil = await axios({
                method: "post",
                url: url,
                data: fd,
            }).then(function (response) {
                return response;
            });
  return (
    <div>
      
    </div>
  )
}
